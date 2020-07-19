FROM node:alpine

WORKDIR /usr/local/apps
RUN apk add git
RUN git clone https://github.com/osorionicolas/delen
WORKDIR /usr/local/apps/delen
RUN npm install --unsafe-perm

CMD npm run delen
EXPOSE 3000 5000