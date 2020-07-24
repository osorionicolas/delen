#!/bin/sh

git stash
git pull
npm install -p ./client
npm run build --prod -p ./client
mv client/build server
npm install -p ./server
