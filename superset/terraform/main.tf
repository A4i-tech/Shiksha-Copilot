# ---------------------------------------------------------------------------
# Resource Group
# ---------------------------------------------------------------------------
resource "azurerm_resource_group" "superset" {
  name     = var.resource_group_name
  location = var.location
  tags     = var.tags
}

# ---------------------------------------------------------------------------
# Azure Container Registry
# Used to host the ETL Docker image (instead of inline pip install)
# ---------------------------------------------------------------------------
resource "azurerm_container_registry" "superset" {
  name                = var.acr_name
  resource_group_name = azurerm_resource_group.superset.name
  location            = azurerm_resource_group.superset.location
  sku                 = "Basic"
  admin_enabled       = false
  tags                = var.tags
}

# ---------------------------------------------------------------------------
# AKS Cluster
# ---------------------------------------------------------------------------
resource "azurerm_kubernetes_cluster" "superset" {
  name                = var.cluster_name
  location            = azurerm_resource_group.superset.location
  resource_group_name = azurerm_resource_group.superset.name
  dns_prefix          = var.cluster_name
  kubernetes_version  = var.kubernetes_version

  # System-assigned managed identity — no service principal credentials to rotate
  identity {
    type = "SystemAssigned"
  }

  default_node_pool {
    name                = "system"
    vm_size             = var.node_vm_size
    os_disk_size_gb     = var.node_disk_size_gb
    type                = "VirtualMachineScaleSets"

    # Auto-scaling
    enable_auto_scaling = var.enable_auto_scaling
    node_count          = var.enable_auto_scaling ? null : var.node_count
    min_count           = var.enable_auto_scaling ? var.min_node_count : null
    max_count           = var.enable_auto_scaling ? var.max_node_count : null

    # Spread nodes across availability zones
    zones = ["1", "2", "3"]

    node_labels = {
      "nodepool" = "system"
    }
  }

  network_profile {
    network_plugin    = "azure"
    load_balancer_sku = "standard"
    outbound_type     = "loadBalancer"
  }

  # Enable OIDC + Workload Identity (useful for future Azure Key Vault integration)
  oidc_issuer_enabled       = true
  workload_identity_enabled = true

  # Monitoring
  monitor_metrics {}

  tags = var.tags
}

# ---------------------------------------------------------------------------
# Grant AKS permission to pull images from ACR
# ---------------------------------------------------------------------------
resource "azurerm_role_assignment" "aks_acr_pull" {
  principal_id                     = azurerm_kubernetes_cluster.superset.kubelet_identity[0].object_id
  role_definition_name             = "AcrPull"
  scope                            = azurerm_container_registry.superset.id
  skip_service_principal_aad_check = true
}
