#!/bin/sh

docker stop delen
docker rm delen

docker pull node:alpine

docker run -it -d --restart=always --name delen -p 3000:3000 -p 5000:5000 -e TZ='America/Argentina/Buenos_Aires' -v /home/docker/images/delen/delen:/usr/local/apps/delen:rw -w /usr/local/apps/delen node:alpine npm run delen
