# port-forward.ps1
# Opens Superset via minikube service tunnel (more stable than kubectl port-forward
# on Windows Docker driver — minikube manages the NodePort tunnel automatically).
# Run once in a terminal. Ctrl+C to stop.
# Usage: .\port-forward.ps1

param([string]$Namespace = "superset")

Write-Host "Starting minikube service tunnel for Superset (Ctrl+C to stop) ..."
minikube service superset -n $Namespace
