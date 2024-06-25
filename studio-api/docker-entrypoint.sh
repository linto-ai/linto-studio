#!/bin/bash
set -e

echo "Waiting mongo..."
/wait-for-it.sh $DB_HOST_MONGO:$DB_PORT_MONGO --timeout=20 --strict -- echo " $DB_HOST_MONGO:$DB_PORT_MONGO is up"

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
        exit 1
        ;;
    esac
    shift
done

echo "RUNNING : $script"
cd /usr/src/app/conversation-manager
mkdir -p storages
mkdir -p storages/audios
mkdir -p storages/audios/original
mkdir -p storages/pictures
mkdir -p storages/audiowaveform

cron

eval "$script"
