# port-forward.ps1
# Auto-restarts kubectl port-forward on exit (idle timeout, crash, etc.)
# Keeps Superset on http://localhost:8088 reliably.
# Run once in a dedicated terminal. Ctrl+C to stop.
# Usage: .\port-forward.ps1

param(
    [string]$Namespace = "superset",
    [string]$Ports     = "8088:8088"
)

Write-Host "Auto port-forward superset $Ports (Ctrl+C to stop)"

while ($true) {
    Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Starting kubectl port-forward service/superset $Ports -n $Namespace"
    kubectl port-forward service/superset $Ports -n $Namespace
    Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Exited (code=$LASTEXITCODE). Restarting in 2s..."
    Start-Sleep -Seconds 2
}
