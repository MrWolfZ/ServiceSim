FROM node:8 as build
WORKDIR /usr/build
COPY ./package*.json ./
RUN npm install --no-color
COPY ./ ./
RUN npm run build-full --no-color

FROM node:8
WORKDIR /usr/src/app
COPY ./package*.json ./
RUN npm install --only=production --no-color
COPY --from=build /usr/build/dist ./dist

EXPOSE 3000
CMD [ "npm", "start" ]
