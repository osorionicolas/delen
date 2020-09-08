FROM node:alpine

WORKDIR /usr/local/apps/delen
COPY ./server .

CMD node app.js
EXPOSE 5000