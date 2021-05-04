#!/bin/bash

cd ./components/vue_app
npm install

cd ../../
npm run build-app

set +a
