FROM node:20.15.1 as builder

ARG WEBSERVER_HTTP_PORT=80

RUN apt-get update -y && \
  apt-get install gettext -y && \
  apt-get install nginx -y

# Copy project in default workdir
WORKDIR /usr/src/app/conversation-manager-front
COPY . /usr/src/app/conversation-manager-front
RUN npm install 

RUN rm -rf /usr/share/nginx/html/*
COPY ./config/nginx/nginx.conf /etc/nginx/nginx.conf
RUN sed -i "s/listen [0-9]\+;/listen ${WEBSERVER_HTTP_PORT};/" /etc/nginx/nginx.conf

COPY ./docker-entrypoint.sh /

RUN chown -R node:node /usr/src/app /usr/share/nginx/html /var/lib/nginx /var/log/nginx && \
  touch /run/nginx.pid && chown -R node:node /run/nginx.pid
USER node

HEALTHCHECK CMD curl -f http://localhost

EXPOSE ${WEBSERVER_HTTP_PORT}
ENTRYPOINT ["/docker-entrypoint.sh"]
