#!/bin/sh

git pull https://github.com/osorionicolas/delen
npm install -p client
npm run build --prod -p client
mv client/build server
npm install -p server