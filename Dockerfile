FROM node:8 as build-env
WORKDIR /usr/build
COPY ./package*.json .
RUN npm install
COPY . .
RUN npm run build-full

FROM node:8
WORKDIR /usr/src/app
COPY ./package*.json .
RUN npm install --only=production
COPY --from=build-env ./dist ./dist

EXPOSE 3000
CMD [ "npm", "start" ]
