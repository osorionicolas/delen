#!/bin/sh

docker stop delen
docker rm delen

docker pull secretcolossus/delen:latest

docker run -it -d --restart=always -p 5000:5000 -e REACT_APP_SERVER_IP_ADDRESS=apps.local --name delen secretcolossus/delen:latest