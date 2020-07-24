#!/bin/sh

git stash
git pull
chmod 777 *.sh
npm install -p ./client
npm run build --prod -p ./client
mv client/build server
npm install -p ./server
./build.sh
./run.sh
