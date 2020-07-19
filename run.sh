#!/bin/sh

docker stop delen
docker rm delen

docker pull secretcolossus/delen:latest

docker run -it -d --restart=always -p 3000:3000 -p 5000:5000 --name delen secretcolossus/delen:latest