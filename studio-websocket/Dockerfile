FROM node:22.22.0-alpine

RUN apk upgrade --no-cache && apk add --no-cache \
  bash \
  curl \
  su-exec \
  shadow \
  && ln -s /sbin/su-exec /usr/local/bin/gosu

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm ci --omit=dev && \
  rm -rf /usr/local/lib/node_modules/npm /usr/local/lib/node_modules/corepack \
         /usr/local/bin/npm /usr/local/bin/npx /usr/local/bin/corepack
COPY . .

HEALTHCHECK CMD curl -f http://localhost
EXPOSE 80

COPY docker-entrypoint.sh /
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["npm", "run", "start"]
