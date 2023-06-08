kubectl delete secret formrec-secret -n test
kubectl delete secret ocr-secret -n test
kubectl create secret generic formrec-secret --from-literal=Billing=https://formrec-container-jph.cognitiveservices.azure.com/ --from-literal=ApiKey=<<apikey>> -n test
kubectl create secret generic ocr-secret --from-literal=Billing=https://jph-cogservices-containers.cognitiveservices.azure.com/ --from-literal=ApiKey=<<apikey>> -n test