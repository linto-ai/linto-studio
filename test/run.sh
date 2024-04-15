#!/bin/bash
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
    echo "waiting 5s for" $dockerName "to be healthy"
    sleep 5
  done
done

# TODO: check docker healthy with a function
echo "run tests"

npm run e2e:electron
./stop.sh


