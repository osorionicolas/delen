#!/bin/sh

docker stop delen
docker rm delen

docker pull secretcolossus/delen:latest

docker run -it -d --restart=always -p 5000:5000 --name delen -v delen_files:/usr/local/apps/delen/files
 secretcolossus/delen:latest