FROM node:alpine

WORKDIR /usr/local/apps/delen
COPY ./server .
VOLUME ./server/files ./files

CMD node app.js
EXPOSE 5000