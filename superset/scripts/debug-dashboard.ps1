param([string]$BaseUrl = "http://localhost:8088", [string]$DashId = "5")

$login = Invoke-RestMethod -Method POST -Uri "$BaseUrl/api/v1/security/login" `
    -ContentType 'application/json' `
    -Body '{"username":"admin","password":"admin","provider":"db","refresh":false}' `
    -SessionVariable S

$h = @{ Authorization = "Bearer $($login.access_token)" }

Write-Host "=== CHARTS ==="
$cr = Invoke-RestMethod -Uri "$BaseUrl/api/v1/chart/?q=(page_size:50)" -Headers $h -WebSession $S
$cr.result | ForEach-Object { Write-Host "  id=$($_.id)  name=$($_.slice_name)" }

Write-Host ""
Write-Host "=== DASHBOARD $DashId position_json ==="
$d = Invoke-RestMethod -Uri "$BaseUrl/api/v1/dashboard/$DashId" -Headers $h -WebSession $S
$d.result.position_json
