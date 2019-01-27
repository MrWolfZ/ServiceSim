FROM node:8 as build
WORKDIR /usr/build
COPY ./package*.json ./
RUN npm install --color false
COPY ./ ./
RUN npm run build-full --color false

FROM node:8
WORKDIR /usr/src/app
COPY ./package*.json ./
RUN npm install --only=production --color false
COPY --from=build /usr/build/dist ./dist

EXPOSE 3000
CMD [ "npm", "start" ]
