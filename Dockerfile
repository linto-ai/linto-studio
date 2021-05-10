FROM node:latest

RUN apt-get update -y && \
    apt-get install gettext -y

# Copy project in default workdir
WORKDIR /usr/src/app/conversation-manager
COPY . /usr/src/app/conversation-manager


# Frontend components/vue_app
WORKDIR /usr/src/app/conversation-manager/components/vue_app
RUN npm install && npm install -s node-sass
#npm run build:css && vue-cli-service build --mode development

# Backend startup
WORKDIR /usr/src/app/conversation-manager

# Backend install
RUN npm install

#LOCAL END
HEALTHCHECK CMD node docker-healthcheck.js || exit 1
EXPOSE 80

COPY ./wait-for-it.sh /
COPY ./docker-entrypoint.sh /
ENTRYPOINT ["/docker-entrypoint.sh"]

#CMD ["node", "app.js"]
