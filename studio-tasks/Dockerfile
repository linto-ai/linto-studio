FROM node:26.13.0-alpine

WORKDIR /usr/src/app/studio-tasks
COPY package.json index.js ./
COPY tasks ./tasks
COPY lib ./lib

USER node

CMD ["node", "index.js"]
