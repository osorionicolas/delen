#!/bin/sh

git stash
git pull
chmod 777 *.sh
cd client
npm install
npm run build --prod
mv build ../server
cd ../server
npm install
cd ..
./build.sh
./run.sh
