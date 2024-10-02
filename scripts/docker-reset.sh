#!/bin/bash

# Stop and remove all containers
docker stop $(docker ps -aq)
docker rm $(docker ps -aq)

# Remove all volumes
docker volume rm $(docker volume ls -q)

echo "All containers and volumes have been deleted."