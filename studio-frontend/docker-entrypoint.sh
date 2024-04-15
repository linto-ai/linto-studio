#!/bin/bash
set -e

DIR="/usr/src/app/conversation-manager-front/dist/"
BUILD=false

if [ ! -d "$DIR" ]; then
  BUILD=true
  # Take action if $DIR exists. #
  echo "Building ${DIR}..."
  printenv >.env
  npm run build
  rm -rf /usr/share/nginx/html/*
  cp -r ./dist/* /usr/share/nginx/html
fi

while [ "$1" != "" ]; do
  case $1 in
  --build)
      printenv >.env
      npm run build
      rm -rf /usr/share/nginx/html/*
      cp -r ./dist/* /usr/share/nginx/html
    ;;
  --skip)
    echo 'Skip startup param'
    ;;
  *)
    echo "ERROR: Bad argument provided \"$1\""
    exit 1
    ;;
  esac
  shift
done

echo "RUNNING : $script"
cd /usr/src/app/conversation-manager-front

echo "done"
nginx
