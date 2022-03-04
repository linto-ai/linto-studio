FROM node:latest

RUN apt-get update -y && \
    apt-get install gettext -y

# Copy project in default workdir
WORKDIR /usr/src/app/conversation-manager
COPY . /usr/src/app/conversation-manager

# Frontend /vue_app
WORKDIR /usr/src/app/conversation-manager/vue_app
RUN npm install && npm install --save-dev node-sass

# Backend install 
WORKDIR /usr/src/app/conversation-manager
RUN npm install

#LOCAL END
HEALTHCHECK CMD node docker-healthcheck.js || exit 1
EXPOSE 80

COPY ./wait-for-it.sh /
COPY ./docker-entrypoint.sh /
ENTRYPOINT ["/docker-entrypoint.sh"]

#CMD ["node", "app.js"]
