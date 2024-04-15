docker stop studio-frontend-test studio-api-test studio-mongo-test studio-websocket-test

cd $(dirname "$0")
sudo rm -rf ./storages/
sudo cp -R ./seed-storages/ ./storages/

sleep 2
docker-compose -f docker-compose.test.yml up --build -d