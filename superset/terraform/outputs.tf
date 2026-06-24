output "resource_group_name" {
  description = "Resource group containing all Superset resources"
  value       = azurerm_resource_group.superset.name
}

output "cluster_name" {
  description = "AKS cluster name"
  value       = azurerm_kubernetes_cluster.superset.name
}

output "cluster_fqdn" {
  description = "AKS API server FQDN"
  value       = azurerm_kubernetes_cluster.superset.fqdn
}

output "kubeconfig_command" {
  description = "Run this command to configure kubectl after apply"
  value       = "az aks get-credentials --resource-group ${azurerm_resource_group.superset.name} --name ${azurerm_kubernetes_cluster.superset.name} --overwrite-existing"
}

output "acr_login_server" {
  description = "ACR login server — use this in Docker push/pull commands"
  value       = azurerm_container_registry.superset.login_server
}

output "acr_push_commands" {
  description = "Commands to build and push the ETL image to ACR"
  value = <<-EOT
    az acr login --name ${azurerm_container_registry.superset.name}
    docker build -t ${azurerm_container_registry.superset.login_server}/shiksha-etl:latest ../etl/
    docker push ${azurerm_container_registry.superset.login_server}/shiksha-etl:latest
  EOT
}

output "node_resource_group" {
  description = "Auto-created resource group holding AKS node VMs"
  value       = azurerm_kubernetes_cluster.superset.node_resource_group
}

# Sensitive — access via: terraform output -raw kubeconfig
output "kubeconfig" {
  description = "Raw kubeconfig for the AKS cluster"
  value       = azurerm_kubernetes_cluster.superset.kube_config_raw
  sensitive   = true
}
