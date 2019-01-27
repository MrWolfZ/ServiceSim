FROM node:8 as build-env
WORKDIR /usr/build
COPY ./package*.json ./
RUN npm install

FROM node:8
WORKDIR /usr/src/app
COPY ./package*.json ./
RUN npm install --only=production
COPY ./ ./
RUN npm run build-full
COPY ./dist ./dist

EXPOSE 3000
CMD [ "npm", "start" ]
