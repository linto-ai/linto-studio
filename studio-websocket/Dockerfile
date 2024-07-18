FROM node:20.15.1

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install
COPY . .

HEALTHCHECK CMD curl -f http://localhost
EXPOSE 80
CMD ["npm", "run", "start"]
