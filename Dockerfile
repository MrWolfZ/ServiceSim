FROM node:8

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

COPY ./dist ./dist

EXPOSE 3000
CMD [ "npm", "start" ]
