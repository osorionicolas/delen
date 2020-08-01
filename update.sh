#!/bin/sh

git stash
git pull
chmod 777 *.sh
cd /home/docker/images/delen/client
npm install
npm run build --prod
mv build /home/docker/images/delen/server
cd /home/docker/images/delen/server
npm install
cd /home/docker/images/delen
./build.sh
./run.sh
