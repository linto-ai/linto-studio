FROM node:22.22.0-alpine

RUN apk upgrade --no-cache && apk add --no-cache \
  bash \
  curl \
  su-exec \
  shadow \
  && ln -s /sbin/su-exec /usr/local/bin/gosu

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install
COPY . .

HEALTHCHECK CMD curl -f http://localhost
EXPOSE 80

COPY docker-entrypoint.sh /
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["npm", "run", "start"]
