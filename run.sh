#!/bin/sh

docker stop delen
docker rm delen

docker pull secretcolossus/delen:latest

docker run -it -d --restart=always -p 3000:3000 -p 5000:5000 -e REACT_APP_SERVER_IP_ADDRESS=apps.local -v /home/docker/images/delen/files:/usr/local/apps/delen/server/files --name delen secretcolossus/delen:latest
