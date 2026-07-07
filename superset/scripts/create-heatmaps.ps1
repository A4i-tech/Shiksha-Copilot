# create-heatmaps.ps1
# Creates two heatmap charts:
#   1. Subject x Grade        (fact_lesson_plans)
#   2. Day of Week x Hour     (fact_user_activities — adds calculated columns first)
# Usage: .\create-heatmaps.ps1 [-BaseUrl http://localhost:8088] [-Username admin] [-Password admin]

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
        Invoke-RestMethod -Method $Method -Uri $uri -Headers $headers -Body $json -WebSession $script:Session
    } else {
        $resp = Invoke-RestMethod -Method $Method -Uri $uri -Headers $headers -Body $json -SessionVariable "S"
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

# --- Fetch dataset IDs ---
Write-Host "Fetching datasets ..."
$dsResp = Invoke-Superset GET "/api/v1/dataset/?q=(page_size:50)"
$dsMap  = @{}
foreach ($ds in $dsResp.result) { $dsMap[$ds.table_name] = $ds.id }
Write-Host "  Datasets: $($dsMap.Keys -join ', ')"

# -----------------------------------------------------------------------
# Step 1: Add calculated columns to fact_user_activities
#   hour_of_day  = EXTRACT(HOUR FROM created_at)::integer  (0-23)
#   day_of_week  = prefixed day name so alphabetical = chronological
# -----------------------------------------------------------------------
Write-Host ""
Write-Host "Adding calculated columns to fact_user_activities ..."

$uaId = $dsMap["fact_user_activities"]
if (-not $uaId) { throw "Dataset 'fact_user_activities' not found. Run setup-analytics-db.ps1 first." }

# Fetch existing columns so we don't wipe them
$existingDs = Invoke-Superset GET "/api/v1/dataset/$uaId"
$existingCols = $existingDs.result.columns | ForEach-Object {
    @{
        column_name = $_.column_name
        type        = $_.type
        is_dttm     = $_.is_dttm
        filterable  = $_.filterable
        groupby     = $_.groupby
    }
}

if ($false) {
    # placeholder — always run the merge/PUT block below
    $calcCols = @(
        @{
            column_name = "hour_of_day"
            expression  = "LPAD(EXTRACT(HOUR FROM created_at)::text, 2, '0')"
            type        = "VARCHAR"
            is_dttm     = $false
            filterable  = $true
            groupby     = $true
            verbose_name = "Hour of Day (0-23)"
        }
        @{
            column_name  = "day_of_week"
            # Prefix with number so alphabetical sort = Mon→Sun
            expression   = "CASE EXTRACT(ISODOW FROM created_at)::integer WHEN 1 THEN '1-Mon' WHEN 2 THEN '2-Tue' WHEN 3 THEN '3-Wed' WHEN 4 THEN '4-Thu' WHEN 5 THEN '5-Fri' WHEN 6 THEN '6-Sat' WHEN 7 THEN '7-Sun' END"
            type         = "VARCHAR"
            is_dttm      = $false
            filterable   = $true
            groupby      = $true
            verbose_name = "Day of Week"
        }
    )

    # Merge physical columns with new calculated ones (PUT replaces ALL columns).
    # Strip any stale hour_of_day/day_of_week entries first — they may exist in the
    # DB from a prior partial run without showing in the API response, causing a
    # duplicate-column constraint on PUT.
    $calcColNames = $calcCols | ForEach-Object { $_.column_name }
    $filteredCols = $existingCols | Where-Object { $calcColNames -notcontains $_.column_name }
    $mergedCols   = @($filteredCols) + @($calcCols)

    Refresh-Csrf
    try {
        Invoke-Superset PUT "/api/v1/dataset/$uaId" @{ columns = $mergedCols } | Out-Null
        Write-Host "  Added: hour_of_day, day_of_week"
    } catch {
        if ($_ -match "already exist") {
            Write-Host "  Calculated columns already present (skipping PUT)."
        } else {
            throw
        }
    }
    # Sync physical columns back in case any were dropped
    Refresh-Csrf
    try { Invoke-Superset PUT "/api/v1/dataset/$uaId/refresh" $null | Out-Null } catch {}
}

# Refresh CSRF after PUT
Refresh-Csrf

# -----------------------------------------------------------------------
# Helper: metric object
# -----------------------------------------------------------------------
function Metric($col, $agg) {
    @{
        expressionType = "SIMPLE"
        column         = @{ column_name = $col }
        aggregate      = $agg
        label          = "$agg($col)"
        optionName     = "metric_$($col)_$($agg.ToLower())"
    }
}

# -----------------------------------------------------------------------
# Step 2: Create heatmap charts
# -----------------------------------------------------------------------
$charts = @(

    # Chart A: Subject x Grade
    @{
        slice_name      = "Lesson Plans: Subject x Grade Heatmap"
        viz_type        = "heatmap"
        datasource_id   = $dsMap["fact_lesson_plans"]
        datasource_type = "table"
        params          = @{
            viz_type             = "heatmap"
            time_range           = "No filter"
            all_columns_x        = "subject"
            all_columns_y        = "grade"
            metric               = Metric "lp_id" "COUNT"
            linear_color_scheme  = "blue_white_yellow"
            xscale_interval      = 1
            yscale_interval      = 1
            normalize_across     = "heatmap"
            left_margin          = "auto"
            bottom_margin        = 100
            show_legend          = $true
            show_perc            = $true
        }
    }

    # Chart B: Day of Week x Hour
    @{
        slice_name      = "App Usage: Day x Hour Heatmap"
        viz_type        = "heatmap"
        datasource_id   = $uaId
        datasource_type = "table"
        params          = @{
            viz_type             = "heatmap"
            time_range           = "No filter"
            all_columns_x        = "hour_of_day"
            all_columns_y        = "day_of_week"
            metric               = Metric "activity_id" "COUNT"
            linear_color_scheme  = "blue_white_yellow"
            xscale_interval      = 1
            yscale_interval      = 1
            normalize_across     = "heatmap"
            left_margin          = "auto"
            bottom_margin        = "auto"
            show_legend          = $true
            show_perc            = $false
        }
    }
)

Write-Host ""
Write-Host "Creating heatmap charts ..."
$createdIds = @()

foreach ($c in $charts) {
    # Idempotent check
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
Write-Host "Heatmap chart IDs: $($createdIds -join ', ')"
Write-Host "View at: $BaseUrl/chart/list"
Write-Host ""
Write-Host "To add to a dashboard, run:"
Write-Host "  Go to dashboard -> Edit -> drag charts from 'Your charts & filters' panel"
