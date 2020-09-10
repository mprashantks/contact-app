const path = require('path');

module.exports = {
  apps: [{
    name: "contactapi",
    cwd: path.join(process.env.CODE_DIR, process.env.NODE_APP_SRC),
    script: "server.js",
    instances: process.env.CONCURRENT_PROCESSES,
    exec_mode: "cluster",
    error_file: path.join(process.env.LOG_DIR, process.env.NODE_APP_SRC, "node_app.err.log")
  }]
};