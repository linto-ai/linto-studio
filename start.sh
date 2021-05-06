#!/bin/bash
set -uea
SUDO=''
. .env # Source all env

sudo rm -r ./storages/database
mkdir storages/database

rm -f ./mongo-seeds/init.js 
envsubst < ./mongo-seeds/init-template.js > ./mongo-seeds/init.js
docker-compose up