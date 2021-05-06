FROM node:latest

WORKDIR /usr/src/app/conversation-manager

COPY . /usr/src/app/conversation-manager
RUN npm install

#LOCAL END
HEALTHCHECK CMD node docker-healthcheck.js || exit 1
EXPOSE 80

COPY ./wait-for-it.sh /
COPY ./docker-entrypoint.sh /
ENTRYPOINT ["/docker-entrypoint.sh"]

#CMD ["node", "app.js"]
