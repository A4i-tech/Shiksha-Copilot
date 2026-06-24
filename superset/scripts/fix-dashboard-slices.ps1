# fix-dashboard-slices.ps1
# Deletes and recreates dashboards with correct position_json (chart layout).
# Run after create-charts.ps1.

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

# --- Auth ---
Write-Host "Logging in ..."
$login = Invoke-Superset POST "/api/v1/security/login" ([ordered]@{
    username = $Username; password = $Password; provider = "db"; refresh = $false
})
$script:Token = $login.access_token
$script:Csrf  = (Invoke-Superset GET "/api/v1/security/csrf_token/").result
Write-Host "  Auth OK"

# --- Fetch chart IDs ---
$chartMap = @{}
foreach ($c in (Invoke-Superset GET "/api/v1/chart/?q=(page_size:50)").result) {
    $chartMap[$c.slice_name] = $c.id
}
Write-Host "Charts found: $($chartMap.Count)"

function Get-ChartId($name) {
    if (-not $chartMap.ContainsKey($name)) { throw "Chart '$name' not found." }
    $chartMap[$name]
}

# --- Build position_json as a PSCustomObject tree (avoids array mutation bug) ---
function Build-PositionJson([int[]]$ids, [string[]]$names) {
    # Build rows: 2 charts per row, each width=6; last odd chart is full-width=12
    $rows      = [System.Collections.Generic.List[object]]::new()
    $allCharts = [System.Collections.Generic.Dictionary[string,object]]::new()
    $ci        = 0
    $ri        = 0

    while ($ci -lt $ids.Count) {
        $rowId       = "ROW-r$ri"
        $rowChildren = [System.Collections.Generic.List[string]]::new()

        $colsInRow = if (($ci + 1) -lt $ids.Count) { 2 } else { 1 }

        for ($col = 0; $col -lt $colsInRow -and $ci -lt $ids.Count; $col++) {
            $elemId = "CHART-c$ci"
            $width  = if ($colsInRow -eq 1) { 12 } else { 6 }
            $allCharts[$elemId] = [PSCustomObject]@{
                type     = "CHART"
                id       = $elemId
                children = @()
                parents  = @($rowId, "GRID_ID", "ROOT_ID")
                meta     = [PSCustomObject]@{
                    chartId   = $ids[$ci]
                    width     = $width
                    height    = 50
                    sliceName = $names[$ci]
                }
            }
            $rowChildren.Add($elemId)
            $ci++
        }

        $rows.Add([PSCustomObject]@{
            id       = $rowId
            children = $rowChildren.ToArray()
            meta     = [PSCustomObject]@{ background = "BACKGROUND_TRANSPARENT" }
        })
        $ri++
    }

    # Assemble full layout object
    $layout = [ordered]@{
        "DASHBOARD_VERSION_KEY" = "v2"
        "ROOT_ID" = [PSCustomObject]@{
            type     = "ROOT"
            id       = "ROOT_ID"
            children = @("GRID_ID")
        }
        "GRID_ID" = [PSCustomObject]@{
            type     = "GRID"
            id       = "GRID_ID"
            children = @($rows | ForEach-Object { $_.id })
            parents  = @("ROOT_ID")
        }
    }

    foreach ($row in $rows) {
        $layout[$row.id] = [PSCustomObject]@{
            type     = "ROW"
            id       = $row.id
            children = $row.children
            parents  = @("GRID_ID", "ROOT_ID")
            meta     = $row.meta
        }
    }

    foreach ($key in $allCharts.Keys) {
        $layout[$key] = $allCharts[$key]
    }

    $layout | ConvertTo-Json -Depth 20
}

# --- Dashboard definitions ---
$dashboards = [ordered]@{
    "HM Dashboard"   = @(
        "Lesson Plans Created Over Time",
        "LBA Avg Score by Subject",
        "App Usage by Section"
    )
    "CRP Dashboard"  = @(
        "Lesson Plans Created Over Time",
        "LBA Avg Score by Subject",
        "AI Actions by Type"
    )
    "BEO Dashboard"  = @(
        "App Usage by Section",
        "Lesson Plans Created Over Time",
        "Users by Role"
    )
    "DDPI Dashboard" = @(
        "Lesson Plans Created Over Time",
        "LBA Avg Score by Subject",
        "AI Actions by Type",
        "App Usage by Section",
        "Chatbot Resolution Rate",
        "Users by Role"
    )
}

# --- Delete existing dashboards ---
Write-Host "Deleting existing dashboards ..."
$existing = Invoke-Superset GET "/api/v1/dashboard/?q=(page_size:50)"
foreach ($d in $existing.result) {
    if ($dashboards.Contains($d.dashboard_title)) {
        Invoke-Superset DELETE "/api/v1/dashboard/$($d.id)" | Out-Null
        Write-Host "  Deleted: $($d.dashboard_title) id=$($d.id)"
    }
}

# Need fresh CSRF after DELETEs
$script:Csrf = (Invoke-Superset GET "/api/v1/security/csrf_token/").result

# --- Recreate dashboards with correct position_json ---
Write-Host "Creating dashboards ..."
foreach ($title in $dashboards.Keys) {
    $chartNames = $dashboards[$title]
    $ids        = $chartNames | ForEach-Object { Get-ChartId $_ }
    $posJson    = Build-PositionJson $ids $chartNames

    $body = [ordered]@{
        dashboard_title = $title
        position_json   = $posJson
        published       = $true
    }

    $resp = Invoke-Superset POST "/api/v1/dashboard/" $body
    Write-Host "  [$title] id=$($resp.id)  charts=$($ids -join ',')"
}

Write-Host ""
Write-Host "Done. Open $BaseUrl/dashboard/list"
