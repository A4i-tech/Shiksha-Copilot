# swap-to-views.ps1
# Swaps each chart's dataset from raw fact tables -> enriched views (vw_*).
# Also creates the view datasets if they don't exist yet.
# Run after port-forward.ps1 is running.
# Usage: .\swap-to-views.ps1 [-BaseUrl http://localhost:8088] [-Username admin] [-Password admin]

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

function Refresh-Csrf { $script:Csrf = (Invoke-Superset GET "/api/v1/security/csrf_token/").result }

# --- Auth ---
Write-Host "Logging in ..."
$login = Invoke-Superset POST "/api/v1/security/login" @{
    username = $Username; password = $Password; provider = "db"; refresh = $false
}
$script:Token = $login.access_token
Refresh-Csrf
Write-Host "  Auth OK"

# --- Get analytics DB id ---
$dbQ   = [Uri]::EscapeDataString("(filters:!((col:database_name,opr:eq,value:'Analytics DB')))")
$dbRes = Invoke-Superset GET "/api/v1/database/?q=$dbQ"
if ($dbRes.count -eq 0) { throw "Database 'Analytics DB' not found. Run setup-analytics-db.ps1 first." }
$analyticsDbId = $dbRes.result[0].id
Write-Host "  Analytics DB id=$analyticsDbId"

# --- Load all existing datasets into a map ---
$dsMap  = @{}
$page   = 0
do {
    $q    = [Uri]::EscapeDataString("(page:$page,page_size:100)")
    $resp = Invoke-Superset GET "/api/v1/dataset/?q=$q"
    foreach ($ds in $resp.result) { $dsMap[$ds.table_name] = $ds.id }
    $page++
} while ($resp.result.Count -eq 100)
Write-Host "  Loaded $($dsMap.Count) existing datasets"

# --- Ensure a physical dataset for each view ---
# Views are regular PostgreSQL objects — Superset treats them like tables.
function Ensure-ViewDataset($viewName) {
    if ($dsMap.ContainsKey($viewName)) {
        Write-Host "  [view:$viewName] already exists id=$($dsMap[$viewName])"
        return $dsMap[$viewName]
    }
    Refresh-Csrf
    $resp = Invoke-Superset POST "/api/v1/dataset/" @{
        database   = $analyticsDbId
        schema     = "public"
        table_name = $viewName
    }
    $id = $resp.id
    $dsMap[$viewName] = $id
    Write-Host "  [view:$viewName] created id=$id"
    # Trigger column sync
    Refresh-Csrf
    Invoke-Superset PUT "/api/v1/dataset/$id/refresh" $null | Out-Null
    return $id
}

$viewIds = @{}
foreach ($v in @("vw_lesson_plans","vw_user_activities","vw_chatbot_sessions","vw_lba_attempts")) {
    $viewIds[$v] = Ensure-ViewDataset $v
}

# --- Map: raw table -> replacement view dataset id ---
# Charts whose current dataset is a raw fact table get swapped to the enriched view.
$tableToView = @{
    "fact_lesson_plans"    = $viewIds["vw_lesson_plans"]
    "fact_user_activities" = $viewIds["vw_user_activities"]
    "fact_chatbot_sessions"= $viewIds["vw_chatbot_sessions"]
    "fact_lba_attempts"    = $viewIds["vw_lba_attempts"]
}

# --- List all charts and update matching ones ---
Write-Host "`nFetching charts ..."
$charts = (Invoke-Superset GET "/api/v1/chart/?q=$(
    [Uri]::EscapeDataString('(page_size:100)')
)").result

$updated = 0
foreach ($chart in $charts) {
    $currentTable = $chart.datasource_name_text
    if (-not $tableToView.ContainsKey($currentTable)) { continue }

    $newDsId = $tableToView[$currentTable]
    Write-Host "  Updating chart '$($chart.slice_name)' ($currentTable -> view id=$newDsId)"
    Refresh-Csrf
    Invoke-Superset PUT "/api/v1/chart/$($chart.id)" @{
        datasource_id   = $newDsId
        datasource_type = "table"
    } | Out-Null
    $updated++
}

Write-Host "`nDone. $updated chart(s) updated to enriched views."
Write-Host "Open Superset UI and verify each chart still renders correctly."
