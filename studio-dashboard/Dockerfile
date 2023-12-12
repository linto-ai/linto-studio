FROM node:18

WORKDIR /usr/src/app/dashboard

COPY package.json ./
COPY wait-for-it.sh /
COPY docker-entrypoint.sh /

RUN npm install
COPY . .

EXPOSE 80
ENTRYPOINT ["/docker-entrypoint.sh"]