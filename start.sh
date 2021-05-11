#!/bin/bash
set -uea
SUDO=''
. .dockerenv # Source all env

mkdir -p ${VOLUME_DATABASE_FOLDER}
sudo chown -R ${USER} ${VOLUME_DATABASE_FOLDER}

# Regenerate mono init.js file 
rm -f ./mongo-seeds/init.js
envsubst < ./mongo-seeds/init-template.js > ./mongo-seeds/init.js

# Start docker (build if image not found)
docker-compose up
