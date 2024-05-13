#!/bin/bash

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT_DIR="$SCRIPT_DIR/../"
CODE_DIR="$ROOT_DIR/code"

echo "Changing to Root..."
cd "$ROOT_DIR"

echo "Building Docker Compose File..."
docker-compose build

echo "Loging in to Docker"
docker login

echo "Tagging Image"
docker tag todo-list-todolist binaryqubit/todolist:latest

echo "Pushing Image"
docker push binaryqubit/todolist:latest

echo "Deleting Images"
docker rmi -f $(docker images -q)