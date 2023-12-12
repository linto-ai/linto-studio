FROM node:18

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install
COPY . .

HEALTHCHECK CMD curl -f http://localhost
EXPOSE 80
CMD ["npm", "run", "start"]
