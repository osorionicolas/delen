#!/bin/sh

docker stop delen
docker rm delen
docker rmi secretcolossus/delen:latest

docker build -t secretcolossus/delen:latest .
docker push secretcolossus/delen:latest