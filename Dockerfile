FROM node:alpine

WORKDIR /usr/local/apps/delen
COPY ./server .

EXPOSE 5000
CMD node app.js