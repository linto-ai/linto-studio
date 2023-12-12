FROM node:16.2.0 as builder

RUN apt-get update -y && \
  apt-get install gettext -y && \
  apt-get install nginx -y

# Copy project in default workdir
WORKDIR /usr/src/app/conversation-manager-front
COPY . /usr/src/app/conversation-manager-front
RUN npm install 

RUN rm -rf /usr/share/nginx/html/*
COPY ./config/nginx/nginx.conf /etc/nginx/nginx.conf

COPY ./docker-entrypoint.sh /

HEALTHCHECK CMD curl -f http://localhost

EXPOSE 80
ENTRYPOINT ["/docker-entrypoint.sh"]