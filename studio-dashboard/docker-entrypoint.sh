#!/bin/bash
set -e

echo "Waiting mongo..."
/wait-for-it.sh $DB_HOST:$DB_PORT --timeout=20 --strict -- echo " $DB_HOST:$DB_PORT is up"

script="node src/app.js"

while [ "$1" != "" ]; do
  case $1 in
  --run-cmd?*)
    script=${1#*=} # Deletes everything up to "=" and assigns the remainder.
    ;;
  --run-cmd=) # Handle the case of an empty --run-cmd=
    die 'ERROR: "--run-cmd" requires a non-empty option argument.'
    ;;
  --skip)
    echo 'Skip starup param'
    ;;
  *)
    echo "ERROR: Bad argument provided \"$1\""
    # exit 1
    ;;
  esac
  shift
done

echo "RUNNING : $script"
cd /usr/src/app/dashboard

eval "$script"
