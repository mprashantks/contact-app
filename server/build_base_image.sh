#!/usr/bin/env bash

CONFIG_FILE='./production-config.env'
if [[ -f "${CONFIG_FILE}" ]]
then
    source ${CONFIG_FILE}
else
    echo "Config file not found."
    fail
fi

#docker rmi ${BASE_IMAGE_NAME}
docker build -f Dockerfile.api_base \
             -t ${BASE_IMAGE_NAME} \
             --build-arg BASE_IMAGE_URI=${BASE_IMAGE_URI} \
             --build-arg NODE_LOG_DIR=${LOG_DIR}/${NODE_APP_SRC} \
             --build-arg CODE_DIR=${CODE_DIR} \
             . || fail
