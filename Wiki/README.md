
# Deploying Form Recognizer Containers

**WARNING**  You've been warned.  These instructions demonstrate a deployment on AKS and are for demonstration purposes only.  The assumed use case is on-prem where the cluster will be secured as per the user's internal security policies.  The saas implementation of Form Recognizer uses Blob Storage for persistence and for security of documents.  The saas service endpoints are protected by a TLS interface and IAM.   The default configuration demonstrated by this repo will leave your containers accessible to the public internet, without TLS, and without IAM security. ****

# How to start

# Prerequisites

## Gating Access

The containers described in this repo are currently "gated" and require that you fill out a request form to get access to them.  The containers themselves are publicly accessible, however they require a public internet connection to report the billing usage.  By filling out the following form your Api Credentials will be permitted to report billing remotely.  You will be able to deploy the containers without obtaining "gating access".  However, your Billing Connection will fail.

https://customervoice.microsoft.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR7en2Ais5pxKtso_Pz4b1_xUNlpBU1lFSjJUMFhKNzVHUUVLN1NIOEZETiQlQCN0PWcu

**WARNING** Please note that it might take up to 10 business days for your request to be processed after you fill out this form. 

## Installing Tools 
This guide will use locally installed tools. So, please follow the below guidelines to install tools appropriately. 


#### Install Azure CLI 

- Follow the link to install the latest version of Azure CLI: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli-windows?tabs=azure-cli#install-or-update.
- If you already have az cli installed, please make sure the version is 2.32.0 or newer. Run **az version** in a command prompt to verify. 
    > az version

- Open a command prompt as administrator. We will use this window to run the deployment 

- If you're using a local installation, sign in to the Azure CLI by using the **az login** command. To finish the authentication process, follow the steps displayed in your terminal. For additional sign-in options, see Sign in with the Azure CLI.

    > az login

- Make sure you are using the correct Azure subscription. To validate and change the current subscription you can use the following commands.
  > az account show

  > az account list

  > az account set --subscription \<name or id\>
  

Note: Run the commands as administrator.

#### Install Kubectl

- Install kubectl locally using the az aks install-cli command:

  > az aks install-cli

- Run the following command to your search path so the 'kubectl.exe' can be found. 

  > set PATH=%PATH%;C:\Users\azureuser\.azure-kubectl

Note that "kubectl" is included in the installation of Azure Cloud Shell.  

#### Install Helm 

- There are various methods to install Helm, in this guide Chocolatey pacakage manager is preferred to install Helm. 

- Open Windows Powershell with administrator. Run the following command to install chocolatey first:

  >Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

- After installing chocolatey appropriately, run the below command to install helm:

  >choco install kubernetes-helm

If you would like to review other methods, follow this link: https://helm.sh/docs/intro/install/ 

#### Install Git 

- Download and install Git by accepting the defaults during the installation. https://gitforwindows.org/ 

## Cloning Repository

- Open Git Gui and select "Clone Existing Repository". 

- Use: https://dev.azure.com/CEandS/Azure-AI-Building-Intelligent-Solutions/_git/Deploying-Form-Recognizer-Containers as source location and "C:\repos" as Target Directory. And select Clone.

- This repo contains helm charts to expedite the deployment of Form Recognizer containers.  The deployment instructions are broken into two phases :
  - prebuilt models : These are standalone models that require minimal interaction with other containers.
  - custom models : To build a custom model, it is necessary to install the FOTT UI and other infrastructure.  It is possible to use the prebuilt models without deploying the custom model containers and infrastructure. These instructions will explain how to get the FOTT UI to interact with the local containers.
  


# Azure Kubernetes Services (AKS) Deployment
## Create a resource group
Change the Azure region (location) and resource group name. This operation should take few seconds to run.

> az group create --name \<name\> --location \<region\>

You can see an example below:

> az group create --name aksrg --location eastus

If you don't know the code for your location you can get a list by running the following command

> az account list-locations -o table

## Create an Azure Container Registry
You'll need to store your container images in an Azure Container Registry (ACR) to run your application in your AKS cluster using Helm. 

> az acr create --resource-group \<resource group name\> --name \<ACR name\> --sku Basic

You can find more details about Azure Container Registry creation [here](https://docs.microsoft.com/en-us/cli/azure/acr?view=azure-cli-latest#az_acr_create).

You can see an example below:

> az acr create --resource-group aksrg --name acrhelmcs --sku Basic

## Enable cluster monitoring 
[Container Insights](https://docs.microsoft.com/en-us/azure/azure-monitor/containers/container-insights-overview) is a feature designed to monitor the performance of container workloads deployed to, among others, AKS.

Verify Microsoft.OperationsManagement and Microsoft.OperationalInsights are registered on your subscription. To check the registration status:

> az provider show -n Microsoft.OperationsManagement -o table
> 
> az provider show -n Microsoft.OperationalInsights -o table

If they are not registered, register Microsoft.OperationsManagement and Microsoft.OperationalInsights using:

> az provider register --namespace Microsoft.OperationsManagement
>
> az provider register --namespace Microsoft.OperationalInsights

## Create AKS cluster

To create AKS cluster, the Azure Portal or Bash environment in [Azure Cloud Shell](https://shell.azure.com/) can also be used but here we will be using az aks create command.
Change the name parameter and use the previously created resource group in --resource-group parameter. This operation will take a few minutes to complete.

> az aks create --resource-group \<resource group name\> --name \<AKS cluster name\> --node-count 1 --enable-addons monitoring --generate-ssh-keys --attach-acr \<ACR name\> --node-vm-size \<node VM size\>

You can see an example below:

> az aks create --resource-group aksrg --name aksclustercogsvc --node-count 1 --enable-addons monitoring --generate-ssh-keys --attach-acr acrhelmcs --node-vm-size Standard_A2_v2

    Note: When you create an AKS cluster, a second resource group is automatically created to store the AKS resources. 

You can use the system node pool but it's recommended to schedule your application pods on user node pools. 
 
 The following command will create an user node pool. 

> az aks nodepool add --resource-group \<resource group name\> --cluster-name <\cluster name\> --name \<nodepoolname\> --node-count \<number of nodes\>  --node-vm-size \<node VM size\>

You can see an example below:

 > az aks nodepool add --resource-group aksrg --cluster-name aksclustercogsvc --name usrnodepool1 --node-count 2 --node-vm-size Standard_B4ms

Please notice that burstable VMs are not recommended for production environments: [Recommended CPU cores and memory](https://docs.microsoft.com/en-us/azure/applied-ai-services/form-recognizer/containers/form-recognizer-container-install-run?tabs=layout#recommended-cpu-cores-and-memory)

## Connect to AKS cluster

You can configure kubectl to connect to your Kubernetes cluster using the az aks get-credentials command:

  > az aks get-credentials --resource-group \<resource group name\> --name \<AKS cluster name\>

You can see an example below:

  > az aks get-credentials --resource-group aksrg --name aksclustercogsvc 

You can verify the connection with the below command:

````
kubectl get nodes
````

You can review the link for more details: https://docs.microsoft.com/en-us/azure/aks/kubernetes-walkthrough#connect-to-the-cluster 

# Deploying to your AKS cluster 

### Dependencies:





## Instructions for Deploying Prebuilt Containers

Create a kubernetes namespace

```
kubectl create namespace <YourNamespace>

```


### Deploy Secrets

Deploy the following Azure Services:

OCR (Computer Vision) - https://docs.microsoft.com/en-us/azure/cognitive-services/computer-vision/overview-ocr

Form Recognizer - https://docs.microsoft.com/en-us/azure/applied-ai-services/form-recognizer/

Collect the Endpoint and ApiKey for each service.  You will need it for the next step.


Use the following commands to deploy the secrets.  These secrets represent the credentials for your Azure Services

```
kubectl create secret generic formrec-secret --from-literal=Billing=<YourFormRecEndpoint> --from-literal=ApiKey=<YourFormRecApiKey> -n <YourNamespace>
kubectl create secret generic ocr-secret --from-literal=Billing=<YourOcrReadEndpoint> --from-literal=ApiKey=<YourOcrReadApiKey> -n <YourNamespace>
```

Confirm the secret deployment
```
kubectl get secrets -n <YourNamespace>
```

You should see something like:
```
NAME                TYPE            DATA     AGE
formrec-secret      Opaque           *         *
ocr-secret          Opaque           *        *
```


### Deploy your first container

OCR

```
helm install ocr charts/visionRead -n <YourNamespace>
```

```
kubectl get all -n <YourNamespace>


NAME                                   READY   STATUS              RESTARTS   AGE
pod/ocr-vision-read-5f4cdbdc95-2wtpf   0/1     ContainerCreating   0          48s

NAME                      TYPE           CLUSTER-IP    EXTERNAL-IP     PORT(S)          AGE
service/ocr-vision-read   LoadBalancer   10.0.35.157   X.X.145.11   8080:32299/TCP   48s

NAME                              READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/ocr-vision-read   0/1     1            0           48s

NAME                                         DESIRED   CURRENT   READY   AGE
replicaset.apps/ocr-vision-read-5f4cdbdc95   1         1         0       48s
```
ContainerCreating will eventually transition to Running.  At this point you should be able to access the container at the "EXTERNAL-IP" 

url :  http://EXTERNAL-IP:8080

At this point you should be able to interact with the swagger interface to confirm that it is running properly.

Once successful, the remaining prebuilt model containers can be deployed in the same way.  

*NOTE*  The name of the deployment in the helm command matters!!  Some of the containers are dependent on the existence of other containers.  For example, the Layout container uses the OCR container.  The charts are configured with an assumption that certain names will be used.  Use the following naming convention:

```
helm install ocr charts/visionRead -n <yournamespace>
helm install layout charts/formrecLayout -n <yournamespace>
helm install businesscard charts/formrecBusinessCard -n <yournamespace>
helm install id charts/formrecID -n <yournamespace>
helm install invoice charts/formrecInvoice -n <yournamespace>
helm install receipt charts/formrecReceipt -n <yournamespace>

```

### Container Configuration Guide 

I created a K8s cluster using 4 user nodes of Standard_D8as_v4.  I ran several tests using a mix of pods and concurrent user threads using JMeter.  Due to resource limits on my subscription, I was unable to test more pods and larger VMs.  I tried some configurations less than 8x16 and I'd discourage it.  Use 8x16 for CV Read and Layout container at a minimum.  All tests are run against the Layout API.

| Memory x Cpu | # Pods | # Threads | Results  |
| ------------ | ------ | --------- | -------- |
| 8x16         | 1      | 1         | 8 - 10s  |
| 8x16         | 1      | 2         | 8 - 16s  |
| 8x16         | 1      | 5         | 23 - 48s |
| 8x16         | 1      | 10        | 28 - 89s |
| 8x16         | 2      | 2         | 8 - 16s  |
| 8x16         | 2      | 5         | 12 - 23s |
| 8x16         | 2      | 10        | 20 - 68s |
| 8x16         | 2      | 15        | 21 - 75s |
| 8x16         | 2      | 20        | 26 - 87s |

To configure resources (for example "Layout"), go to "/charts/formrecLayout/values.yaml".  There you will see a section that looks like this:

```
replicaCount: 1
```

"replicaCount" controls the number of pods.

```
resources: {}
  # We usually recommend not to specify default resources and to leave this as a conscious
  # choice for the user. This also increases chances charts run on environments with little
  # resources, such as Minikube. If you do want to specify resources, uncomment the following
  # lines, adjust them as necessary, and remove the curly braces after 'resources:'.
  # limits:
  #   cpu: 4
  #   memory: 16G
  # requests:
  #   cpu: 4
  #   memory: 16G
  ```

  The "resources" section allows you to set the cpu and memory configuration per pod.  The above configuration is null or "{}".  This configuration will use any resources available.  To set strict limits on the resources allocated per pod, remove the curly braces and uncomment the "limits" section.

  In summary, the "resources" tag sets the cpu/memory config per pod.  "replicaCount" is a multiplier that defines the number of pods to deploy.

  ## Deploy Custom API

  Install the RabbitMQ Operator

  ```
  kubectl apply -f "https://github.com/rabbitmq/cluster-operator/releases/latest/download/cluster-operator.yml"
  ```

  Deploy RabbitMQ Cluster

  ```
  kubectl apply -f rabbitmq.yaml -n <yournamespace>
  ```

  Claim Persistent Volume

  ```
  kubectl apply -f azurefile.yaml -n <yournamespace>
  ```

  Deploy containers for custom API

  ```
  helm install formrec-customapi charts/formrecCustomApi -n <yournamespace>
  ```

  ```
  helm install formrec-customsupervised charts/formrecCustomSupervised -n <yournamespace>
  ```

  Deploy backend application

  ```
  helm install backend charts/backend <yournamespace>
  ```

  Deploy frontend application

  ```
  helm install frontend charts/frontend <yournamespace>
  ```