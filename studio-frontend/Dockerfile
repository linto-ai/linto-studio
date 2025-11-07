FROM node:22.14.0 as builder

RUN apt-get update -y && \
  apt-get install -y gettext nginx gosu

# Copy project in default workdir
WORKDIR /usr/src/app/studio-frontend
COPY . /usr/src/app/studio-frontend
RUN npm install 

RUN rm -rf /usr/share/nginx/html/*
COPY ./config/nginx/nginx.conf /etc/nginx/nginx.conf
RUN chown node:node /etc/nginx/nginx.conf \
  && chmod u+w /etc/nginx/nginx.conf

COPY ./docker-entrypoint.sh /

RUN touch /run/nginx.pid

HEALTHCHECK CMD curl -f http://localhost

EXPOSE 80
ENTRYPOINT ["/docker-entrypoint.sh"]
