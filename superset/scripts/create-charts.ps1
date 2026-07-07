# create-charts.ps1
# Creates 6 metric charts in Superset via REST API.
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
    param([string]$Method, [string]$Path, [hashtable]$Body)
    $uri     = "$BaseUrl$Path"
    $headers = @{ "Content-Type" = "application/json" }
    if ($script:Token) { $headers["Authorization"] = "Bearer $($script:Token)" }
    if ($script:Csrf)  { $headers["X-CSRFToken"]   = $script:Csrf }
    $json = if ($Body) { $Body | ConvertTo-Json -Depth 20 } else { $null }
    if ($script:Session) {
        Invoke-RestMethod -Method $Method -Uri $uri -Headers $headers -Body $json -WebSession $script:Session -TimeoutSec 30
    } else {
        $resp = Invoke-RestMethod -Method $Method -Uri $uri -Headers $headers -Body $json -SessionVariable "S" -TimeoutSec 30
        $script:Session = $S
        $resp
    }
}

# --- Auth ---
Write-Host "Logging in ..."
$login = Invoke-Superset POST "/api/v1/security/login" @{
    username = $Username; password = $Password; provider = "db"; refresh = $false
}
$script:Token = $login.access_token

$csrfResp    = Invoke-Superset GET "/api/v1/security/csrf_token/"
$script:Csrf = $csrfResp.result
Write-Host "  Auth OK"

# --- Fetch dataset IDs by name ---
Write-Host "Fetching dataset IDs ..."
$dsMap = @{}
$dsResp = Invoke-Superset GET "/api/v1/dataset/?q=(page_size:50)"
foreach ($ds in $dsResp.result) {
    $dsMap[$ds.table_name] = $ds.id
}
Write-Host "  Found: $($dsMap.Keys -join ', ')"

function Get-DsId($name) {
    if (-not $dsMap.ContainsKey($name)) { throw "Dataset '$name' not found. Run setup-analytics-db.ps1 first." }
    $dsMap[$name]
}

# --- Helper: metric object ---
function Metric($col, $agg) {
    @{
        expressionType = "SIMPLE"
        column         = @{ column_name = $col }
        aggregate      = $agg
        label          = "$agg($col)"
        optionName     = "metric_$($col)_$($agg.ToLower())"
    }
}

# --- Chart definitions ---
$charts = @(

    # 1. LP Created Over Time — echarts_timeseries_line
    @{
        slice_name     = "Lesson Plans Created Over Time"
        viz_type       = "echarts_timeseries_line"
        datasource_id  = Get-DsId "fact_lesson_plans"
        datasource_type = "table"
        params         = @{
            viz_type         = "echarts_timeseries_line"
            granularity_sqla = "created_at"
            time_grain_sqla  = "P1W"
            time_range       = "Last 90 days"
            metrics          = @( Metric "lp_id" "COUNT" )
            groupby          = @("status")
            row_limit        = 10000
            show_legend      = $true
        }
    }

    # 2. LBA Avg Score by Subject — dist_bar (echarts_bar not in 3.1.3)
    @{
        slice_name      = "LBA Avg Score by Subject"
        viz_type        = "dist_bar"
        datasource_id   = Get-DsId "fact_lba_attempts"
        datasource_type = "table"
        params          = @{
            viz_type      = "dist_bar"
            time_range    = "No filter"
            metrics       = @( Metric "score" "AVG" )
            groupby       = @("subject")
            columns       = @()
            row_limit     = 50
            show_legend   = $false
            y_axis_format = ".2f"
        }
    }

    # 3. AI Actions by Type — pie (echarts_pie not in 3.1.3)
    @{
        slice_name      = "AI Actions by Type"
        viz_type        = "pie"
        datasource_id   = Get-DsId "fact_ai_actions"
        datasource_type = "table"
        params          = @{
            viz_type       = "pie"
            time_range     = "No filter"
            metric         = Metric "action_id" "COUNT"
            groupby        = @("action_type")
            row_limit      = 50
            show_legend    = $true
            labels_outside = $true
            donut          = $false
        }
    }

    # 4. App Usage by Section — dist_bar (echarts_bar not in 3.1.3)
    @{
        slice_name      = "App Usage by Section"
        viz_type        = "dist_bar"
        datasource_id   = Get-DsId "fact_user_activities"
        datasource_type = "table"
        params          = @{
            viz_type    = "dist_bar"
            time_range  = "No filter"
            metrics     = @( Metric "activity_id" "COUNT" )
            groupby     = @("app_section")
            columns     = @()
            row_limit   = 50
            show_legend = $false
        }
    }

    # 5. Chatbot Resolution Rate — pie (echarts_pie not in 3.1.3)
    @{
        slice_name      = "Chatbot Resolution Rate"
        viz_type        = "pie"
        datasource_id   = Get-DsId "fact_chatbot_sessions"
        datasource_type = "table"
        params          = @{
            viz_type       = "pie"
            time_range     = "No filter"
            metric         = Metric "session_id" "COUNT"
            groupby        = @("resolved")
            row_limit      = 10
            show_legend    = $true
            labels_outside = $true
            donut          = $false
        }
    }

    # 6. Users by Role — pie (echarts_pie not in 3.1.3)
    @{
        slice_name      = "Users by Role"
        viz_type        = "pie"
        datasource_id   = Get-DsId "dim_users"
        datasource_type = "table"
        params          = @{
            viz_type       = "pie"
            time_range     = "No filter"
            metric         = Metric "user_id" "COUNT"
            groupby        = @("role")
            row_limit      = 20
            show_legend    = $true
            labels_outside = $true
            donut          = $false
        }
    }
)

# --- Create charts ---
Write-Host "Creating $($charts.Count) charts ..."
$createdIds = @()

foreach ($c in $charts) {
    # Check if already exists
    $enc      = [Uri]::EscapeDataString("(filters:!((col:slice_name,opr:eq,value:'$($c.slice_name)')))")
    $existing = Invoke-Superset GET "/api/v1/chart/?q=$enc"
    if ($existing.count -gt 0) {
        $id = $existing.result[0].id
        Write-Host "  [$($c.slice_name)] already exists id=$id, skipping."
        $createdIds += $id
        continue
    }

    # Serialize params to JSON string (API expects string, not object)
    $paramsJson = $c.params | ConvertTo-Json -Depth 20

    $body = @{
        slice_name      = $c.slice_name
        viz_type        = $c.viz_type
        datasource_id   = $c.datasource_id
        datasource_type = $c.datasource_type
        params          = $paramsJson
    }

    $resp = Invoke-Superset POST "/api/v1/chart/" $body
    Write-Host "  [$($c.slice_name)] created id=$($resp.id)"
    $createdIds += $resp.id
}

Write-Host ""
Write-Host "Chart IDs: $($createdIds -join ', ')"
Write-Host "View at: $BaseUrl/chart/list"

# Export IDs for dashboard script
$createdIds | ConvertTo-Json | Out-File -FilePath "$PSScriptRoot\chart-ids.json" -Encoding utf8
Write-Host "IDs saved to scripts\chart-ids.json (used by create-dashboards.ps1)"
