docker build -t formrec-frontend .
docker tag formrec-frontend:latest jphformrec.azurecr.io/jameshoff/formrec-frontend:latest
docker push jphformrec.azurecr.io/jameshoff/formrec-frontend:latest

