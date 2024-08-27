FROM node:20.15.1 as builder

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

# Create a non-root user and group named linto & change ownership of the application files
RUN groupadd -r linto && useradd -r -g linto linto && \
  chown -R linto:linto /usr/src/app /usr/share/nginx/html /var/lib/nginx /var/log/nginx && \
  touch /run/nginx.pid && chown -R linto:linto /run/nginx.pid
USER linto

HEALTHCHECK CMD curl -f http://localhost

EXPOSE 80
ENTRYPOINT ["/docker-entrypoint.sh"]