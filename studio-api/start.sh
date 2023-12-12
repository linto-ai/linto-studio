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
    -b   | --backend-build     Backend build
    -f   | --frontend-build    Frontend build

    -bf  | -fb              Do all command
    -h   | --help           Information on command args
USAGE
  exit 1
}

BACK_BUILD=false
FRONT_BUILD=false

# process arguments
while [[ $# -gt 0 ]]; do
  case "$1" in
  -fb | -bf)
    BACK_BUILD=true
    FRONT_BUILD=true
    shift 1
    ;;
  -b | --backend-build)
    BACK_BUILD=true
    shift 1
    ;;
  -f | --frontend-build)
    FRONT_BUILD=true
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
chown -R ${USER} ${VOLUME_DATABASE_FOLDER}


if [ "$FRONT_BUILD" = true ]; then
  echo -e '\e[31mFrontend build\e[0m'
  DIR="/platform-conversation-manager-front/"
  if [ -d "$DIR" ]; then
    echo "Installing config files in ${DIR}..."
    git clone git@github.com:linto-ai/platform-conversation-manager-front.git
  else
    ###  Control will jump here if $DIR does NOT exists ###
    echo "Skip clone."
  fi
  git checkout next
  cd platform-conversation-manager-front
  docker build -t conversation-manager-front .
  cd .. 
fi

if [ "$BACK_BUILD" = true ]; then
  echo -e '\e[31mBuilding image\e[0m'
  docker-compose build
fi

# Regenerate mono init.js file 
rm -f ./config/seeds/mongodb/init.js
envsubst < ./config/seeds/mongodb/init-template.js > ./config/seeds/mongodb/init.js

# Start docker (build if image not found)
docker-compose up
