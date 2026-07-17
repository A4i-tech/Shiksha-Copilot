# setup-mobile-dashboard.ps1
# Step 1: Finds the existing leaders dashboard and prints its UUID.
# Step 2: After you manually create a mobile version in the UI,
#         run with -GetUuid to list all dashboard UUIDs so you can copy the new one.
# Usage:
#   .\setup-mobile-dashboard.ps1                   # lists dashboards + UUIDs
#   .\setup-mobile-dashboard.ps1 -Title "Leaders"  # filters by title

param(
    [string]$BaseUrl  = "http://localhost:8088",
    [string]$Username = "admin",
    [string]$Password = "admin",
    [string]$Title    = ""
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
Write-Host "  Auth OK`n"

# --- List all dashboards ---
$resp = Invoke-Superset GET "/api/v1/dashboard/?q=$([Uri]::EscapeDataString('(page_size:100)'))"

$dashboards = $resp.result
if ($Title) { $dashboards = $dashboards | Where-Object { $_.title -like "*$Title*" } }

Write-Host ("=" * 70)
Write-Host ("{0,-45} {1}" -f "Title", "UUID")
Write-Host ("=" * 70)
foreach ($d in $dashboards) {
    Write-Host ("{0,-45} {1}" -f $d.title, $d.uuid)
}
Write-Host ("=" * 70)
Write-Host "`nTo create a mobile dashboard:"
Write-Host "  1. Open Superset UI -> Dashboards -> find 'Leaders Dashboard'"
Write-Host "  2. Click '...' -> Duplicate"
Write-Host "  3. Rename to 'Leaders Dashboard (Mobile)'"
Write-Host "  4. Edit layout: rearrange charts into a single column"
Write-Host "  5. Save"
Write-Host "  6. Re-run this script to get the new UUID"
Write-Host "  7. Set supersetMobileDashboardUuid in environment.prod.ts and environment.uat.ts"
