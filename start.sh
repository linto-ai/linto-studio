#!/bin/bash
set -uea
SUDO=''
. .env # Source all env

mkdir -p storages/database

# Regenerate mono init.js file 
rm -f ./mongo-seeds/init.js
envsubst < ./mongo-seeds/init-template.js > ./mongo-seeds/init.js

# Start docker (build if image not found)
docker-compose up
