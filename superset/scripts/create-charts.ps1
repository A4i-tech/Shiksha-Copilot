# create-charts.ps1
# Creates 7 charts matching the existing Shiksha Copilot dashboard.
# Run after setup-analytics-db.ps1 has created the DB connection and datasets.
# Usage: .\create-charts.ps1 [-BaseUrl http://localhost:8088] [-Username admin] [-Password admin]

param(
    [string]$BaseUrl  = "http://localhost:8088",
    [string]$Username = "admin",
    [string]$Password = "admin"
)

$ErrorActionPreference = "Stop"

$script:Session = $null
$script:Token   = $null
$script:Csrf    = $null

function Invoke-Superset {
    param([string]$Method, [string]$Path, $Body)
    $uri     = "$BaseUrl$Path"
    $headers = @{ "Content-Type" = "application/json" }
    if ($script:Token) { $headers["Authorization"] = "Bearer $($script:Token)" }
    if ($script:Csrf)  { $headers["X-CSRFToken"]   = $script:Csrf }
    $json = if ($null -ne $Body) {
        if ($Body -is [string]) { $Body } else { $Body | ConvertTo-Json -Depth 20 }
    } else { $null }
    if ($script:Session) {
        Invoke-RestMethod -Method $Method -Uri $uri -Headers $headers -Body $json -WebSession $script:Session -TimeoutSec 30
    } else {
        $resp = Invoke-RestMethod -Method $Method -Uri $uri -Headers $headers -Body $json -SessionVariable "S" -TimeoutSec 30
        $script:Session = $S
        $resp
    }
}

function Refresh-Csrf {
    $script:Csrf = (Invoke-Superset GET "/api/v1/security/csrf_token/").result
}

# --- Auth ---
Write-Host "Logging in ..."
$login = Invoke-Superset POST "/api/v1/security/login" @{
    username = $Username; password = $Password; provider = "db"; refresh = $false
}
$script:Token = $login.access_token
Refresh-Csrf
Write-Host "  Auth OK"

# --- Fetch existing datasets and analytics DB id ---
Write-Host "Fetching datasets and database connection ..."
$dsMap  = @{}
$dsResp = Invoke-Superset GET "/api/v1/dataset/?q=(page_size:100)"
foreach ($ds in $dsResp.result) { $dsMap[$ds.table_name] = $ds.id }
Write-Host "  Physical datasets: $($dsMap.Keys -join ', ')"

$dbQ   = [Uri]::EscapeDataString("(filters:!((col:database_name,opr:eq,value:'Analytics DB')))")
$dbRes = Invoke-Superset GET "/api/v1/database/?q=$dbQ"
if ($dbRes.count -eq 0) { throw "Database 'Analytics DB' not found. Run setup-analytics-db.ps1 first." }
$analyticsDbId = $dbRes.result[0].id
Write-Host "  Analytics DB id=$analyticsDbId"

# --- Helpers ---
function Metric($col, $agg) {
    @{
        expressionType = "SIMPLE"
        column         = @{ column_name = $col }
        aggregate      = $agg
        label          = "$agg($col)"
        optionName     = "metric_$($col)_$($agg.ToLower())"
    }
}

# Creates a virtual (SQL) dataset if it doesn't already exist; returns its id.
function Ensure-VirtualDataset($name, $sql) {
    if ($dsMap.ContainsKey($name)) {
        Write-Host "  [virtual:$name] cached id=$($dsMap[$name])"
        return $dsMap[$name]
    }
    $enc   = [Uri]::EscapeDataString("(filters:!((col:table_name,opr:eq,value:'$name')))")
    $check = Invoke-Superset GET "/api/v1/dataset/?q=$enc"
    if ($check.count -gt 0) {
        $id = $check.result[0].id
        $dsMap[$name] = $id
        Write-Host "  [virtual:$name] already exists id=$id"
        return $id
    }
    Refresh-Csrf
    $resp = Invoke-Superset POST "/api/v1/dataset/" @{
        database   = $analyticsDbId
        table_name = $name
        sql        = $sql
    }
    $id = $resp.id
    $dsMap[$name] = $id
    Write-Host "  [virtual:$name] created id=$id"
    return $id
}

# --- Virtual datasets (SQL joins needed for charts) ---
Write-Host ""
Write-Host "Ensuring virtual datasets ..."

# C1: lesson plans with region name (fact_lesson_plans -> dim_users -> dim_regions)
$lpByRegionId = Ensure-VirtualDataset "v_lp_by_region" @"
SELECT
    dr.name     AS zone_name,
    dr.type     AS zone_type,
    flp.subject,
    flp.medium,
    flp.status,
    flp.created_at
FROM fact_lesson_plans flp
JOIN dim_users du   ON flp.user_id  = du.user_id
JOIN dim_regions dr ON du.region_id = dr.region_id
"@

# C4 + C5: users with active/inactive status (activity in last 30 days)
$userStatusId = Ensure-VirtualDataset "v_user_status" @"
SELECT
    du.user_id,
    du.name,
    du.role,
    CASE
        WHEN MAX(fa.created_at) > NOW() - INTERVAL '30 days' THEN 'Active'
        ELSE 'Inactive'
    END AS status,
    MAX(fa.created_at) AS last_active
FROM dim_users du
LEFT JOIN fact_user_activities fa ON du.user_id = fa.user_id
GROUP BY du.user_id, du.name, du.role
"@

# C6: feedback score bucketed into categories
$feedbackId = Ensure-VirtualDataset "v_feedback_score" @"
SELECT
    CASE
        WHEN score >= 80 THEN 'Very Good'
        WHEN score >= 60 THEN 'Good'
        ELSE 'Needs Improvement'
    END AS feedback_category,
    created_at
FROM fact_lba_attempts
"@

# C7: lesson chat and edu chat (chatbot) unified for time-series by type
$chatbotId = Ensure-VirtualDataset "v_chatbot_by_type" @"
SELECT created_at, 'Lesson Chat' AS chat_type FROM fact_chatbot_sessions
UNION ALL
SELECT created_at, 'Edu Chat'   AS chat_type FROM fact_ai_actions WHERE action_type = 'chatbot'
"@

# --- Chart definitions (C1 – C7, matching Shiksha Copilot dashboard) ---
$charts = @(

    # C1: Lesson Plans by Zone — bar grouped by region name
    @{
        slice_name      = "Lesson Plans by Zone"
        viz_type        = "dist_bar"
        datasource_id   = $lpByRegionId
        datasource_type = "table"
        params          = @{
            viz_type      = "dist_bar"
            time_range    = "No filter"
            metrics       = @( Metric "zone_name" "COUNT" )
            groupby       = @("zone_name")
            columns       = @()
            row_limit     = 50
            show_legend   = $false
            x_axis_label  = "Zone / Region"
            y_axis_label  = "Lesson Plans"
        }
    }

    # C2: Lesson Plans by Subject — bar
    @{
        slice_name      = "Lesson Plans by Subject"
        viz_type        = "dist_bar"
        datasource_id   = $dsMap["fact_lesson_plans"]
        datasource_type = "table"
        params          = @{
            viz_type      = "dist_bar"
            time_range    = "No filter"
            metrics       = @( Metric "lp_id" "COUNT" )
            groupby       = @("subject")
            columns       = @()
            row_limit     = 20
            show_legend   = $false
            x_axis_label  = "Subject"
            y_axis_label  = "Lesson Plans"
        }
    }

    # C3: Lesson Plans by Medium — donut (Kannada / English / Telugu)
    @{
        slice_name      = "Lesson Plans by Medium"
        viz_type        = "pie"
        datasource_id   = $dsMap["fact_lesson_plans"]
        datasource_type = "table"
        params          = @{
            viz_type       = "pie"
            time_range     = "No filter"
            metric         = Metric "lp_id" "COUNT"
            groupby        = @("medium")
            row_limit      = 10
            show_legend    = $true
            labels_outside = $true
            donut          = $true
        }
    }

    # C4: Active / Inactive Users — donut
    @{
        slice_name      = "Active / Inactive Users"
        viz_type        = "pie"
        datasource_id   = $userStatusId
        datasource_type = "table"
        params          = @{
            viz_type       = "pie"
            time_range     = "No filter"
            metric         = Metric "user_id" "COUNT"
            groupby        = @("status")
            row_limit      = 5
            show_legend    = $true
            labels_outside = $true
            donut          = $true
        }
    }

    # C5: User Activity Table — name, role, status, last active
    @{
        slice_name      = "User Activity Table"
        viz_type        = "table"
        datasource_id   = $userStatusId
        datasource_type = "table"
        params          = @{
            viz_type       = "table"
            time_range     = "No filter"
            metrics        = @()
            groupby        = @()
            all_columns    = @("name", "role", "status", "last_active")
            row_limit      = 100
            page_length    = 25
            include_search = $true
            align_pn       = $false
        }
    }

    # C6: Avg Feedback Score on Generated Content — donut (score buckets)
    @{
        slice_name      = "Avg Feedback Score on Generated Content"
        viz_type        = "pie"
        datasource_id   = $feedbackId
        datasource_type = "table"
        params          = @{
            viz_type       = "pie"
            time_range     = "No filter"
            metric         = Metric "feedback_category" "COUNT"
            groupby        = @("feedback_category")
            row_limit      = 5
            show_legend    = $true
            labels_outside = $true
            donut          = $true
        }
    }

    # C7: Chatbot Requests by Month — grouped time-series bar (Edu Chat / Lesson Chat)
    @{
        slice_name      = "Chatbot Requests by Month"
        viz_type        = "echarts_timeseries_bar"
        datasource_id   = $chatbotId
        datasource_type = "table"
        params          = @{
            viz_type         = "echarts_timeseries_bar"
            granularity_sqla = "created_at"
            time_grain_sqla  = "P1M"
            time_range       = "Last year"
            metrics          = @( Metric "chat_type" "COUNT" )
            groupby          = @("chat_type")
            row_limit        = 10000
            show_legend      = $true
            stack            = $false
            x_axis_label     = "Month"
            y_axis_label     = "Requests"
        }
    }
)

# --- Create charts ---
Write-Host ""
Write-Host "Creating $($charts.Count) charts ..."
$createdIds = @()

foreach ($c in $charts) {
    $enc      = [Uri]::EscapeDataString("(filters:!((col:slice_name,opr:eq,value:'$($c.slice_name)')))")
    $existing = Invoke-Superset GET "/api/v1/chart/?q=$enc"
    if ($existing.count -gt 0) {
        $id = $existing.result[0].id
        Write-Host "  [$($c.slice_name)] already exists id=$id, skipping."
        $createdIds += $id
        continue
    }

    $paramsJson = $c.params | ConvertTo-Json -Depth 20
    $body = @{
        slice_name      = $c.slice_name
        viz_type        = $c.viz_type
        datasource_id   = $c.datasource_id
        datasource_type = $c.datasource_type
        params          = $paramsJson
    }

    Refresh-Csrf
    $resp = Invoke-Superset POST "/api/v1/chart/" $body
    Write-Host "  [$($c.slice_name)] created id=$($resp.id)"
    $createdIds += $resp.id
}

Write-Host ""
Write-Host "Chart IDs: $($createdIds -join ', ')"
Write-Host "View at: $BaseUrl/chart/list"

$createdIds | ConvertTo-Json | Out-File -FilePath "$PSScriptRoot\chart-ids.json" -Encoding utf8
Write-Host "IDs saved to scripts\chart-ids.json (used by create-dashboards.ps1)"
