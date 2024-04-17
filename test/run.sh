#!/bin/bash
export ELECTRON_ENABLE_LOGGING=1

function container_is_health() {
  local container_name=$1
  local health_status=$(docker inspect --format='{{.State.Health.Status}}' $container_name)
  if [ "$health_status" == "healthy" ]; then
    return 0
  else
    return 1
  fi
}

cd $(dirname "$0")

./start.sh


dockerNames=("studio-frontend-test" "studio-api-test" "studio-websocket-test")

for dockerName in "${dockerNames[@]}"
do
  while ! container_is_health $dockerName; do
    echo "waiting for" $dockerName "to be healthy"
    sleep 1
  done
done

# TODO: check docker healthy with a function
echo "run tests"

case $1 in

  collab)
    sleep 1
    npm run cy:collab
    ;;

  simple)
    npm run e2e:electron
    ;;

  all)
    npm run e2e:electron
    sleep 1
    npm run cy:collab
    ;;

  *)
    npm run e2e:electron
    sleep 1
    npm run cy:collab
    ;;
esac

./stop.sh


