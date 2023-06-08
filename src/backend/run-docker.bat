docker build -t formrec-backend .
rem docker tag formrec-backend:latest jphformrec.azurecr.io/jameshoff/formrec-backend:latest
rem docker push jphformrec.azurecr.io/jameshoff/formrec-backend:latest
docker tag formrec-backend:latest docker.io/hoffj66/backend:latest
docker push docker.io/hoffj66/backend:latest