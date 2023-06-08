
Write-Host "Deployng Form Recognizer Containers to local minikube installation"

if (!($kubernetesNamespace = Read-Host "Kubernetes namespace: " )) { Exit }

Write-Host "Creating namespace $kubernetesNamespace"

kubectl create namespace $kubernetesNamespace


function createSecrets{
    if (!($formRecSecretUrl = Read-Host "Form Recognition url: " )) { Exit }
    if (!($formRecSecretApi = Read-Host "Form Recognition api key: " )) { Exit }

    kubectl delete secret formrec-secret -n $kubernetesNamespace
    kubectl create secret generic formrec-secret --from-literal=Billing=$formRecSecretUrl --from-literal=ApiKey=$formRecSecretApi -n $kubernetesNamespace

    if (!($ocrSecretUrl = Read-Host "OCR secret url: " )) { Exit }
    if (!($ocrSecretApi = Read-Host "OCR secret api key: " )) { Exit }

    kubectl delete secret ocr-secret -n $kubernetesNamespace
    kubectl create secret generic ocr-secret --from-literal=Billing=$ocrSecretUrl --from-literal=ApiKey=$ocrSecretApi -n $kubernetesNamespace
}


createSecrets



helm install layout ../charts/formrecLayout -n $kubernetesNamespace 
helm install ocr ../charts/visionRead -n $kubernetesNamespace 
helm install layout ../charts/formrecLayout -n $kubernetesNamespace  
helm install businesscard ../charts/formrecBusinessCard -n $kubernetesNamespace 
helm install id ../charts/formrecID -n $kubernetesNamespace  
helm install invoice ../charts/formrecInvoice -n $kubernetesNamespace 
helm install receipt ../charts/formrecReceipt -n $kubernetesNamespace 

kubectl apply -f "https://github.com/rabbitmq/cluster-operator/releases/latest/download/cluster-operator.yml"

kubectl apply -f ../rabbitmq.yaml -n $kubernetesNamespace 

kubectl apply -f ../azurefile.local.yaml -n $kubernetesNamespace 


helm install formrec-customapi ../charts/formrecCustomApi -n $kubernetesNamespace 
helm install formrec-customsupervised ../charts/formrecCustomSupervised -n $kubernetesNamespace 