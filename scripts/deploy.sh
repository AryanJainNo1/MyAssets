#!/bin/bash

# Build and push backend image
cd estate_planning_backend
docker build -t estate-planning-backend -f Dockerfile.prod .
docker tag estate-planning-backend:latest $ECR_BACKEND_URL:latest
docker push $ECR_BACKEND_URL:latest

# Build and push frontend image
cd ../estate-planning-web
docker build -t estate-planning-frontend .
docker tag estate-planning-frontend:latest $ECR_FRONTEND_URL:latest
docker push $ECR_FRONTEND_URL:latest

# Deploy infrastructure
cd ../infrastructure
terraform init
terraform apply -auto-approve

# Update ECS services
aws ecs update-service --cluster estate-planning-cluster --service estate-planning-backend --force-new-deployment 