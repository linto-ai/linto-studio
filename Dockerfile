FROM node:latest

WORKDIR /usr/src/app/conversation-manager

COPY . /usr/src/app/conversation-manager
RUN npm install

#LOCAL END
HEALTHCHECK CMD node docker-healthcheck.js || exit 1
EXPOSE 80

CMD ["node", "app.js"]
