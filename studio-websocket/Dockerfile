FROM node:20.15.1

RUN apt-get update -y && apt-get install -y gosu

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install
COPY . .

HEALTHCHECK CMD curl -f http://localhost
EXPOSE 80

COPY docker-entrypoint.sh /
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["npm", "run", "start"]
