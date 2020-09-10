#!/usr/bin/env bash

CONFIG_FILE='./production-config.env'
if [[ -f "${CONFIG_FILE}" ]]
then
    source ${CONFIG_FILE}
else
    echo "Config file not found."
    fail
fi

docker stop ${CONTAINER_NAME}
docker rm ${CONTAINER_NAME}
#docker rmi ${IMAGE_NAME}
docker build -f Dockerfile.api \
             -t ${IMAGE_NAME} \
             --build-arg IMAGE_URI=${IMAGE_URI} \
             --build-arg CODE_DIR=${CODE_DIR} \
             --build-arg NODE_APP_SRC=${NODE_APP_SRC} \
             --build-arg CONTAINER_FILES=${CONTAINER_FILES} \
             . || fail
