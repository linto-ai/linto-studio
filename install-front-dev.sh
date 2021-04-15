#!/bin/bash

cd ./components/vue_app
npm install

cd ../../
npm run build-dev

set +a
