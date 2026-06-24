variable "location" {
  description = "Azure region to deploy into"
  type        = string
  default     = "centralindia"
}

variable "resource_group_name" {
  description = "Name of the Azure resource group"
  type        = string
  default     = "shiksha-superset-rg"
}

variable "cluster_name" {
  description = "Name of the AKS cluster"
  type        = string
  default     = "shiksha-superset-aks"
}

variable "kubernetes_version" {
  description = "Kubernetes version for the AKS cluster"
  type        = string
  default     = "1.30"
}

variable "node_count" {
  description = "Number of nodes in the default node pool"
  type        = number
  default     = 2
}

variable "node_vm_size" {
  description = "VM size for AKS nodes. Standard_D2s_v3 = 2 vCPU / 8 GB (recommended for Superset)"
  type        = string
  default     = "Standard_D2s_v3"
}

variable "node_disk_size_gb" {
  description = "OS disk size (GB) for each node"
  type        = number
  default     = 50
}

variable "enable_auto_scaling" {
  description = "Enable cluster autoscaler on the node pool"
  type        = bool
  default     = true
}

variable "min_node_count" {
  description = "Minimum nodes when autoscaling is enabled"
  type        = number
  default     = 2
}

variable "max_node_count" {
  description = "Maximum nodes when autoscaling is enabled"
  type        = number
  default     = 5
}

variable "acr_name" {
  description = "Azure Container Registry name (must be globally unique, alphanumeric only)"
  type        = string
  default     = "shikshasupersetacr"
}

variable "superset_namespace" {
  description = "Kubernetes namespace for Superset"
  type        = string
  default     = "superset"
}

variable "tags" {
  description = "Tags applied to all Azure resources"
  type        = map(string)
  default = {
    project     = "shiksha-copilot"
    component   = "superset"
    managed_by  = "terraform"
  }
}
