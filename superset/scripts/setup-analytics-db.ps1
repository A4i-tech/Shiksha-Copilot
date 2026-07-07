# setup-analytics-db.ps1
# Creates analytics DB connection + all 8 datasets in Superset via REST API.
# Usage: .\setup-analytics-db.ps1 [-BaseUrl http://localhost:8088] [-Username admin] [-Password admin]

param(
    [string]$BaseUrl      = "http://localhost:8088",
    [string]$Username     = "admin",
    [string]$Password     = "admin",
    [string]$AnalyticsDsn = $env:ANALYTICS_DSN
)

$ErrorActionPreference = "Stop"

# Shared web session — persists cookies across all requests
$script:Session = $null

function Invoke-Superset {
    param([string]$Method, [string]$Path, [hashtable]$Body, [string]$Token, [string]$CsrfToken)
    $uri     = "$BaseUrl$Path"
    $headers = @{ "Content-Type" = "application/json" }
    if ($Token)     { $headers["Authorization"] = "Bearer $Token" }
    if ($CsrfToken) { $headers["X-CSRFToken"]   = $CsrfToken }
    $json = if ($Body) { $Body | ConvertTo-Json -Depth 10 } else { $null }

    if ($script:Session) {
        Invoke-RestMethod -Method $Method -Uri $uri -Headers $headers -Body $json -WebSession $script:Session
    } else {
        Invoke-RestMethod -Method $Method -Uri $uri -Headers $headers -Body $json -SessionVariable "NewSession"
        $script:Session = $NewSession
    }
}

# --- 1. Login (seeds the session cookie) ---
Write-Host "Logging in to $BaseUrl ..."
$login = Invoke-Superset -Method POST -Path "/api/v1/security/login" -Body @{
    username = $Username
    password = $Password
    provider = "db"
    refresh  = $false
}
$token = $login.access_token
Write-Host "  Got token: $($token.Substring(0,20))..."

# --- 1b. Fetch CSRF token (uses session cookie) ---
Write-Host "Fetching CSRF token ..."
$csrfResp = Invoke-Superset -Method GET -Path "/api/v1/security/csrf_token/" -Token $token
$csrf = $csrfResp.result
Write-Host "  Got CSRF: $($csrf.Substring(0,10))..."

# --- 2. Create analytics DB connection ---
Write-Host "Creating database connection 'Analytics DB' ..."
$dbBody = @{
    database_name              = "Analytics DB"
    sqlalchemy_uri             = if ($AnalyticsDsn) { $AnalyticsDsn } else { "postgresql+psycopg2://analytics:analytics@analytics-db.superset.svc.cluster.local:5432/analytics" }
    expose_in_sqllab           = $true
    allow_run_async            = $false
    allow_ctas                 = $false
    allow_cvas                 = $false
    allow_dml                  = $false
    force_ctas_schema          = $null
    extra                      = '{"metadata_params":{},"engine_params":{},"metadata_cache_timeout":{},"schemas_allowed_for_file_upload":[]}'
}

$existingDbs = Invoke-Superset -Method GET -Path "/api/v1/database/?q=(filters:!((col:database_name,opr:eq,value:'Analytics DB')))" -Token $token
if ($existingDbs.count -gt 0) {
    $dbId = $existingDbs.result[0].id
    Write-Host "  Already exists, id=$dbId. Skipping create."
} else {
    $dbResp = Invoke-Superset -Method POST -Path "/api/v1/database/" -Body $dbBody -Token $token -CsrfToken $csrf
    $dbId   = $dbResp.id
    Write-Host "  Created, id=$dbId"
}

# --- 3. Create datasets ---
$tables = @(
    "dim_regions",
    "dim_schools",
    "dim_users",
    "fact_lesson_plans",
    "fact_user_activities",
    "fact_ai_actions",
    "fact_chatbot_sessions",
    "fact_lba_attempts"
)

Write-Host "Creating $($tables.Count) datasets ..."
foreach ($tbl in $tables) {
    # Check if dataset already exists
    $enc      = [Uri]::EscapeDataString("(filters:!((col:table_name,opr:eq,value:'$tbl')))")
    $existing = Invoke-Superset -Method GET -Path "/api/v1/dataset/?q=$enc" -Token $token
    if ($existing.count -gt 0) {
        Write-Host "  [$tbl] already exists, skipping."
        continue
    }

    $dsBody = @{
        database    = $dbId
        schema      = "public"
        table_name  = $tbl
    }
    $dsResp = Invoke-Superset -Method POST -Path "/api/v1/dataset/" -Body $dsBody -Token $token -CsrfToken $csrf
    Write-Host "  [$tbl] created, id=$($dsResp.id)"
}

Write-Host ""
Write-Host "Done. Open $BaseUrl/tablemodelview/list/ to see datasets."
