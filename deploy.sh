#!/bin/bash

# Script to deploy oslint on local machine

echo "OSLint Deployer"
echo "by @angrykoala"

git pull

case $1 in
   caddy)
       echo "Deploy Caddy"
       docker-compose up -d --build rabbitmq
       ;;
   oslint)
       echo "Deploy Oslint"
       docker-compose up -d --build oslint
       ;;
   *)
       echo "Deploy OSLint and Caddy"
       docker-compose up -d --build
       ;;
esac

docker system prune -f
docker-compose ps
