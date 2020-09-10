#!/bin/bash

set -e
set -u

# Create directories for supervisor's UNIX socket and logs
mkdir -p /data/conf /data/run /data/logs
chmod 711 /data/conf /data/run /data/logs

# Start Node process manager
pm2-runtime start ${CODE_DIR}/${NODE_APP_SRC}/ecosystem.config.js
