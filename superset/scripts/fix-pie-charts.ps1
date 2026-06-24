# fix-pie-charts.ps1
# Superset 3.1.3 does not register 'echarts_pie'.
# Replaces all 3 pie charts with classic 'pie' viz type.

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

# Classic 'pie' chart params for each chart
$fixes = @(
    @{
        name   = "AI Actions by Type"
        metric = Metric "action_id" "COUNT"
        group  = "action_type"
    }
    @{
        name   = "Chatbot Resolution Rate"
        metric = Metric "session_id" "COUNT"
        group  = "resolved"
    }
    @{
        name   = "Users by Role"
        metric = Metric "user_id" "COUNT"
        group  = "role"
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

    $params = [ordered]@{
        viz_type       = "pie"
        time_range     = "No filter"
        metric         = $fix.metric
        groupby        = @($fix.group)
        row_limit      = 50
        show_legend    = $true
        labels_outside = $true
        donut          = $false
    }

    $body = [ordered]@{
        viz_type = "pie"
        params   = ($params | ConvertTo-Json -Depth 20)
    }
    Invoke-Superset PUT "/api/v1/chart/$id" $body | Out-Null
    $script:Csrf = (Invoke-Superset GET "/api/v1/security/csrf_token/").result
    Write-Host "[$($fix.name)] id=$id -> pie OK"
}

Write-Host "Done. Reload dashboards."
