FROM node:18

WORKDIR /usr/src/app/dashboard

COPY package.json ./
COPY wait-for-it.sh /
COPY docker-entrypoint.sh /

RUN npm install
COPY . .

# Create a non-root user and group named linto & change ownership of the application files
RUN groupadd -r linto && useradd -r -g linto linto && \
    chown -R linto:linto /usr/src/app
USER linto

EXPOSE 80
ENTRYPOINT ["/docker-entrypoint.sh"]