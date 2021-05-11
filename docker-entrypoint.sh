#!/bin/bash
set -e

echo "Waiting MQTT and mongo..."
/wait-for-it.sh $DB_HOST:$DB_PORT --timeout=20 --strict -- echo " $DB_HOST:$DB_PORT is up"

while [ "$1" != "" ]; do
    case $1 in
    --rebuild-vue-app)
        cd /usr/src/app/conversation-manager/components/vue_app
        echo "REBUILDING VUE APP"
        if [[ "$LINTO_STACK_USE_SSL" == true ]]; then
            echo "VUE_APP_URL=http://$LINTO_CONVERSATION_MANAGER_HOST
            VUE_APP_CONVO_API=http://$LINTO_CONVERSATION_MANAGER_HOST/api
            VUE_APP_CONVO_AUTH=http://$LINTO_CONVERSATION_MANAGER_HOST/auth
            VUE_APP_DEBUG=false" >.env.production
        else
            echo "VUE_APP_URL=http://$LINTO_CONVERSATION_MANAGER_HOST
            VUE_APP_CONVO_API=http://$LINTO_CONVERSATION_MANAGER_HOST/api
            VUE_APP_CONVO_AUTH=http://$LINTO_CONVERSATION_MANAGER_HOST/auth
            VUE_APP_DEBUG=false" >.env.production
        fi
            npm run build-app
        ;;
    --reinstall-vue-app)
        cd /usr/src/app/conversation-manager/components/vue_app
        echo "REINSTALL VUE APP"
        npm install
        ;;
    --reinstall-webserver)
        echo "REBUILDING WEBSERVER APP"
        cd /usr/src/app/conversation-manager/components/vue_app
        npm install
        ;;
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

eval "$script"
