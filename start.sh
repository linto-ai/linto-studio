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
    -p   | --pull           Pull image
    -vrb | --vue-rebuild    Rebuild vue

    -pvrb| -vrbp            Do all command
    -h   | --help           Information on command args
USAGE
  exit 1
}

IMAGE_PULL=false
IMAGE_VUE_REBUILD=false

# process arguments
while [[ $# -gt 0 ]]; do
  case "$1" in
  -pvrb | -vrbp)
    IMAGE_PULL=true
    IMAGE_VUE_REBUILD=true
    shift 1
    ;;
  -p | --pull)
    IMAGE_PULL=true
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

mkdir -p ${VOLUME_DATABASE_FOLDER}
sudo chown -R ${USER} ${VOLUME_DATABASE_FOLDER}

if [ "$IMAGE_PULL" = true ]; then
  echo -e '\e[31mPulling image\e[0m' : $LINTO_STACK_IMAGE_TAG
  docker image pull lintoai/linto-platform-conversation-manager:$LINTO_STACK_IMAGE_TAG
fi

if [ "$IMAGE_VUE_REBUILD" = true ]; then
  echo -e '\e[31mForce rebuild vue-app\e[0m'
  EXTRA_COMMAND_DOCKER=--rebuild-vue-app
fi

# Regenerate mono init.js file 
rm -f ./config/seeds/mongodb/init.js
envsubst < ./config/seeds/mongodb/init-template.js > ./config/seeds/mongodb/init.js

# Start docker (build if image not found)
docker-compose up
