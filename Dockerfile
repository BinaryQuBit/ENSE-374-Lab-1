FROM node:lts-bullseye-slim

WORKDIR /usr/src/app/code

COPY code/package*.json ./

COPY code/public ./public
COPY code/views ./views
COPY code/app.js ./

RUN npm install

EXPOSE 88

CMD ["node", "app.js"]
