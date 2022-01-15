FROM node:alpine

RUN mkdir -p /usr/local/apps/delen/node_modules && chown -R node:node /usr/local/apps/delen

COPY ./server/package*.json ./

USER node

RUN npm install

COPY --chown=node:node ./server .

EXPOSE 5000

CMD [ "node", "app.js" ]