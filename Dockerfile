FROM node:16.2.0

RUN apt-get update -y && \
  apt-get install gettext -y && \
  apt-get install ffmpeg -y

# Copy project in default workdir
WORKDIR /usr/src/app/conversation-manager
COPY . /usr/src/app/conversation-manager
RUN npm install

#LOCAL END
HEALTHCHECK CMD node docker-healthcheck.js || exit 1
EXPOSE 80

COPY ./wait-for-it.sh /
COPY ./docker-entrypoint.sh /
ENTRYPOINT ["/docker-entrypoint.sh"]