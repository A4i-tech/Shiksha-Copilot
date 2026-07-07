# create-dashboards.ps1
# Creates 4 role-specific dashboards in Superset via REST API.
# Run after create-charts.ps1.
# Usage: .\create-dashboards.ps1 [-BaseUrl http://localhost:8088] [-Username admin] [-Password admin]

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
$csrfResp     = Invoke-Superset GET "/api/v1/security/csrf_token/"
$script:Csrf  = $csrfResp.result
Write-Host "  Auth OK"

# --- Fetch chart IDs by name ---
Write-Host "Fetching chart IDs ..."
$chartMap = @{}
$chartResp = Invoke-Superset GET "/api/v1/chart/?q=(page_size:50)"
foreach ($c in $chartResp.result) {
    $chartMap[$c.slice_name] = $c.id
}
Write-Host "  Found: $($chartMap.Keys -join ', ')"

function Get-ChartId($name) {
    if (-not $chartMap.ContainsKey($name)) { throw "Chart '$name' not found. Run create-charts.ps1 first." }
    $chartMap[$name]
}

# --- Layout builder ---
# Arranges chart IDs in a 2-column grid (width=6 each).
# Odd last chart gets full width (12).
function Build-Layout([int[]]$chartIds, [string[]]$chartNames) {
    $rows      = [System.Collections.Generic.List[object]]::new()
    $allCharts = [System.Collections.Generic.Dictionary[string,object]]::new()
    $ci        = 0
    $ri        = 0

    while ($ci -lt $chartIds.Count) {
        $rowId       = "ROW-r$ri"
        $rowChildren = [System.Collections.Generic.List[string]]::new()
        $colsInRow   = if (($ci + 1) -lt $chartIds.Count) { 2 } else { 1 }

        for ($col = 0; $col -lt $colsInRow -and $ci -lt $chartIds.Count; $col++) {
            $elemId = "CHART-c$ci"
            $width  = if ($colsInRow -eq 1) { 12 } else { 6 }
            $allCharts[$elemId] = [PSCustomObject]@{
                type     = "CHART"
                id       = $elemId
                children = @()
                parents  = @($rowId, "GRID_ID", "ROOT_ID")
                meta     = [PSCustomObject]@{
                    chartId   = $chartIds[$ci]
                    width     = $width
                    height    = 50
                    sliceName = $chartNames[$ci]
                }
            }
            $rowChildren.Add($elemId)
            $ci++
        }
        $rows.Add([PSCustomObject]@{ id = $rowId; children = $rowChildren.ToArray() })
        $ri++
    }

    $layout = [ordered]@{
        "DASHBOARD_VERSION_KEY" = "v2"
        "ROOT_ID" = [PSCustomObject]@{ type = "ROOT"; id = "ROOT_ID"; children = @("GRID_ID") }
        "GRID_ID" = [PSCustomObject]@{
            type    = "GRID"; id = "GRID_ID"
            children = @($rows | ForEach-Object { $_.id })
            parents  = @("ROOT_ID")
        }
    }
    foreach ($row in $rows) {
        $layout[$row.id] = [PSCustomObject]@{
            type     = "ROW"; id = $row.id; children = $row.children
            parents  = @("GRID_ID", "ROOT_ID")
            meta     = [PSCustomObject]@{ background = "BACKGROUND_TRANSPARENT" }
        }
    }
    foreach ($key in $allCharts.Keys) { $layout[$key] = $allCharts[$key] }

    $layout | ConvertTo-Json -Depth 20
}

# --- Dashboard definitions ---
# Chart names → IDs resolved at runtime
$dashboards = @(
    @{
        title  = "HM Dashboard"
        charts = @(
            "Lesson Plans Created Over Time",
            "LBA Avg Score by Subject",
            "App Usage by Section",
            "Lesson Plans: Subject x Grade Heatmap"
        )
    }
    @{
        title  = "CRP Dashboard"
        charts = @(
            "Lesson Plans Created Over Time",
            "LBA Avg Score by Subject",
            "AI Actions by Type",
            "Lesson Plans: Subject x Grade Heatmap"
        )
    }
    @{
        title  = "BEO Dashboard"
        charts = @(
            "App Usage by Section",
            "Lesson Plans Created Over Time",
            "Users by Role",
            "App Usage: Day x Hour Heatmap"
        )
    }
    @{
        title  = "DDPI Dashboard"
        charts = @(
            "Lesson Plans Created Over Time",
            "LBA Avg Score by Subject",
            "AI Actions by Type",
            "App Usage by Section",
            "Chatbot Resolution Rate",
            "Users by Role",
            "Lesson Plans: Subject x Grade Heatmap",
            "App Usage: Day x Hour Heatmap"
        )
    }
)

# Sync dashboard_slices via kubectl exec into the superset-postgresql pod.
# Superset 3.x POST /api/v1/dashboard/ does not populate the dashboard_slices
# junction table, so charts appear as "deleted" even though IDs are correct in
# position_json. SQL Lab API blocks DML, so we use psql directly.
function Sync-DashboardSlices([int]$DashboardId, [int[]]$ChartIds) {
    $rows = $ChartIds | ForEach-Object { "($DashboardId,$_)" }
    $sql  = "INSERT INTO dashboard_slices (dashboard_id, slice_id) VALUES $($rows -join ',') ON CONFLICT DO NOTHING;"
    try {
        $pgPod = kubectl get pods -n superset -l app.kubernetes.io/name=postgresql `
            --field-selector=status.phase=Running -o jsonpath="{.items[0].metadata.name}" 2>$null
        if (-not $pgPod) { $pgPod = "superset-postgresql-0" }
        kubectl exec -n superset $pgPod -- `
            psql -U superset -d superset -c $sql 2>&1 | Out-Null
        Write-Host "    dashboard_slices synced ($($ChartIds.Count) charts)"
    } catch {
        Write-Warning "    dashboard_slices sync failed (non-fatal): $_"
    }
}

# --- Create dashboards ---
Write-Host "Creating $($dashboards.Count) dashboards ..."
$createdIds = @()

foreach ($d in $dashboards) {
    $ids   = $d.charts | ForEach-Object { Get-ChartId $_ }
    $names = $d.charts

    # Check if already exists
    $enc      = [Uri]::EscapeDataString("(filters:!((col:dashboard_title,opr:eq,value:'$($d.title)')))")
    $existing = Invoke-Superset GET "/api/v1/dashboard/?q=$enc"
    if ($existing.count -gt 0) {
        $id = $existing.result[0].id
        Write-Host "  [$($d.title)] already exists id=$id - re-syncing slices."
        $createdIds += $id
        Sync-DashboardSlices $id $ids
        continue
    }

    $body = @{
        dashboard_title = $d.title
        position_json   = Build-Layout $ids $names
        published       = $true
    }

    $resp = Invoke-Superset POST "/api/v1/dashboard/" $body
    Write-Host "  [$($d.title)] created id=$($resp.id)"
    $createdIds += $resp.id
    Sync-DashboardSlices $resp.id $ids
}

Write-Host ""
Write-Host "Dashboard IDs: $($createdIds -join ', ')"
Write-Host "View at: $BaseUrl/dashboard/list"
