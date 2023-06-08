$randomId=Get-Random
$resourceGroupName='rg-form-rec'
$region = "westeurope"
$acrName = "acrformrec"+$randomId
$aksClusterName = "aksclusterformrec"+$randomId
$sizeMasterNode = "Standard_B4ms"
$nodePoolName = "usernodepool"
# Create Azure Resource Group
$userNodeCount = 2 
$userNodeSize = "Standard_B8ms"
az group create --name $resourceGroupName --location $region

# Create Azure Container Registry

az acr create --resource-group $resourceGroupName --name $acrName --sku Basic

# Enable cluster monitoring 

az provider register --namespace Microsoft.OperationsManagement
az provider register --namespace Microsoft.OperationalInsights

# Create AKS cluster

# Create Master Node
az aks create --resource-group $resourceGroupName --name $aksClusterName --node-count 1 --enable-addons monitoring --generate-ssh-keys --attach-acr $acrName --node-vm-size $sizeMasterNode

# Create User Node

az aks nodepool add --resource-group $resourceGroupName --cluster-name $aksClusterName --name $nodePoolName --node-count $userNodeCount --node-vm-size $userNodeSize

# Connect to AKS cluster

az aks get-credentials --resource-group $resourceGroup --name $aksClusterName

