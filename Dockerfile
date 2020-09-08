FROM node:alpine

WORKDIR /usr/local/apps/delen
COPY ./server .
VOLUME delen_files ./files

CMD node app.js
EXPOSE 5000