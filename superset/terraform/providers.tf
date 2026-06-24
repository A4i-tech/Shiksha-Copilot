terraform {
  required_version = ">= 1.6.0"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.110"
    }
  }

  # Uncomment once you have a storage account for remote state:
  # backend "azurerm" {
  #   resource_group_name  = "shiksha-tfstate-rg"
  #   storage_account_name = "shikshatfstate"
  #   container_name       = "tfstate"
  #   key                  = "superset/aks.tfstate"
  # }
}

provider "azurerm" {
  features {}

  # Set via env vars before running:
  #   export ARM_SUBSCRIPTION_ID="<your-subscription-id>"
  #   export ARM_TENANT_ID="<your-tenant-id>"
  #   export ARM_CLIENT_ID="<your-sp-client-id>"       # only for service principal auth
  #   export ARM_CLIENT_SECRET="<your-sp-secret>"      # only for service principal auth
  # Or run `az login` for interactive auth.
}
