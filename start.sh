#!/bin/bash
set -uea
SUDO=''
. .dockerenv # Source all env

EXTRA_COMMAND_DOCKER=--skip

####################################
###### Parameter command init ######
####################################

echoerr() { echo "$@" 1>&2; }

usage() {
  cat <<USAGE >&2
Usage:
    ./start [-- command args]
    -b   | --build          Force image to build
    -vrb | --vue-rebuild    Rebuild vue
    -h   | --help           Information on command args
USAGE
  exit 1
}

IMAGE_BUILD=false
IMAGE_VUE_REBUILD=false

# process arguments
while [[ $# -gt 0 ]]; do
  case "$1" in
  -bvrb | -vrbb)
    IMAGE_BUILD=true
    IMAGE_VUE_REBUILD=true
    shift 1
    ;;
  -b | --build)
    IMAGE_BUILD=true
    shift 1
    ;;
  -vrb | --vue-rebuild )
    IMAGE_VUE_REBUILD=true
    shift 1
    ;;
  -h | --help)
    usage
    ;;
  *)
    echoerr "Unknown argument: $1"
    usage
    ;;
  esac
done

if [ "$IMAGE_BUILD" = true ]; then
  echo -e '\e[31mForce rebuild image\e[0m'
  docker-compose build
fi

if [ "$IMAGE_VUE_REBUILD" = true ]; then
  echo -e '\e[31mForce rebuild vue-app\e[0m'
  EXTRA_COMMAND_DOCKER=--rebuild-vue-app
fi


mkdir -p ${VOLUME_DATABASE_FOLDER}
sudo chown -R ${USER} ${VOLUME_DATABASE_FOLDER}

# Regenerate mono init.js file 
rm -f ./mongo-seeds/init.js
envsubst < ./mongo-seeds/init-template.js > ./mongo-seeds/init.js

# Start docker (build if image not found)
docker-compose up
