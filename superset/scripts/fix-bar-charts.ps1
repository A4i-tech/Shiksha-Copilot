# fix-bar-charts.ps1
# Superset 3.1.3 does not register 'echarts_bar'.
# Replaces the two bar charts with 'dist_bar' which is always available.

param(
    [string]$BaseUrl  = "http://localhost:8088",
    [string]$Username = "admin",
    [string]$Password = "admin"
)

$ErrorActionPreference = "Stop"
$script:Session = $null; $script:Token = $null; $script:Csrf = $null

function Invoke-Superset {
    param([string]$Method, [string]$Path, $Body)
    $uri     = "$BaseUrl$Path"
    $headers = @{ "Content-Type" = "application/json" }
    if ($script:Token) { $headers["Authorization"] = "Bearer $($script:Token)" }
    if ($script:Csrf)  { $headers["X-CSRFToken"]   = $script:Csrf }
    $json = if ($null -ne $Body) { if ($Body -is [string]) { $Body } else { $Body | ConvertTo-Json -Depth 20 } } else { $null }
    if ($script:Session) {
        Invoke-RestMethod -Method $Method -Uri $uri -Headers $headers -Body $json -WebSession $script:Session
    } else {
        $resp = Invoke-RestMethod -Method $Method -Uri $uri -Headers $headers -Body $json -SessionVariable "S"
        $script:Session = $S; $resp
    }
}

$login = Invoke-Superset POST "/api/v1/security/login" ([ordered]@{
    username=$Username; password=$Password; provider="db"; refresh=$false
})
$script:Token = $login.access_token
$script:Csrf  = (Invoke-Superset GET "/api/v1/security/csrf_token/").result
Write-Host "Auth OK"

function Metric($col, $agg) {
    [ordered]@{
        expressionType = "SIMPLE"
        column         = [ordered]@{ column_name = $col }
        aggregate      = $agg
        label          = "$agg($col)"
        optionName     = "metric_$($col)_$($agg.ToLower())"
    }
}

# dist_bar params for each chart
$fixes = @(
    @{
        name    = "LBA Avg Score by Subject"
        params  = [ordered]@{
            viz_type    = "dist_bar"
            time_range  = "No filter"
            metrics     = @( Metric "score" "AVG" )
            groupby     = @("subject")
            columns     = @()
            row_limit   = 50
            show_legend = $false
            y_axis_format = ".2f"
        }
    }
    @{
        name    = "App Usage by Section"
        params  = [ordered]@{
            viz_type    = "dist_bar"
            time_range  = "No filter"
            metrics     = @( Metric "activity_id" "COUNT" )
            groupby     = @("app_section")
            columns     = @()
            row_limit   = 50
            show_legend = $false
        }
    }
)

# Fetch chart map
$chartMap = @{}
foreach ($c in (Invoke-Superset GET "/api/v1/chart/?q=(page_size:50)").result) {
    $chartMap[$c.slice_name] = $c.id
}

foreach ($fix in $fixes) {
    $id = $chartMap[$fix.name]
    if (-not $id) { Write-Host "Chart '$($fix.name)' not found"; continue }

    $body = [ordered]@{
        viz_type = "dist_bar"
        params   = ($fix.params | ConvertTo-Json -Depth 20)
    }
    Invoke-Superset PUT "/api/v1/chart/$id" $body | Out-Null
    $script:Csrf = (Invoke-Superset GET "/api/v1/security/csrf_token/").result
    Write-Host "[$($fix.name)] id=$id -> dist_bar OK"
}

Write-Host "Done. Reload dashboard."
