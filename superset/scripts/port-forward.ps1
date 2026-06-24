# port-forward.ps1
# Auto-restarts kubectl port-forward on exit (idle timeout, crash, etc.)
# Run once in a terminal. Ctrl+C to stop.
# Usage: .\port-forward.ps1

param(
    [string]$Namespace = "superset",
    [string]$Service   = "service/superset",
    [string]$Ports     = "8088:8088"
)

Write-Host "Auto port-forward $Service $Ports (Ctrl+C to stop)"

while ($true) {
    Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Starting: kubectl port-forward $Service $Ports -n $Namespace"
    kubectl port-forward $Service $Ports -n $Namespace
    $exit = $LASTEXITCODE
    Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Exited (code=$exit). Restarting in 2s..."
    Start-Sleep -Seconds 2
}
