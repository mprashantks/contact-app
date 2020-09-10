const express = require('express');
const config_by_name = require('./config/app_config');

function create_app() {
  let application = express();

  // Set config in app
  let config_name = process.env.NODE_APP_ENV || 'development';
  let config = new config_by_name[config_name]();
  set_app_config(application, config);

  // Set application handlers
  set_app_handlers(application);

  // Initialise logger
  init_logger_handler(application);

  // Initialise DB Sessions
  init_db_session(application);

  // Attach controller
  attach_routes(application);

  // Start listening for requests
  application.listen(application.get('APP_PORT'), () => {
    console.log(`Server listening on port ${application.get('APP_PORT')}`);
  });
}

function set_app_config(application, config) {
  for (const property in config) {
    application.set(property, config[property]);
  }
}

function set_app_handlers(application) {
  let cors = require('cors');
  let bodyParser = require('body-parser');

  application.use(bodyParser.json({limit: '50mb'}));// to support JSON-encoded bodies
  application.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
  application.use(cors());
}

function init_logger_handler(application) {
  let winston = require('winston');
  let morgan = require('morgan');

  let logger = winston.createLogger({
    format: winston.format.combine(
      winston.format.timestamp({
        format: "YY-MM-DD HH:MM:SS"
      }),
      winston.format.json()
    ),
    transports: [
      new winston.transports.File(application.get('LOGGING_CONFIG').file),
      new winston.transports.Console(application.get('LOGGING_CONFIG').console)
    ],
    exitOnError: false, // do not exit on handled exceptions
  });

  // create a stream object with a 'write' function that will be used by `morgan`
  let stream = {
    write: function (message, encoding) {
      // use the 'info' log level so the output will be picked up by both transports (file and console)
      logger.info(message);
    },
  };

  application.use(morgan('combined', {stream}));
}


function init_db_session(application) {
  const fs = require('fs');
  const path = require('path');
  const Sequelize = require('sequelize');
  const basename = path.basename(__filename);

  let db_config = application.get('DB_CRED');
  let db = {Sequelize: Sequelize};
  let all_connection_promises = [];

  for (const db_config_key of Object.keys(db_config)) {
    let config = db_config[db_config_key]['cred'];
    let sequelize = new Sequelize(config.database, config.username, config.password, config, {
      logging: console.log
    });
    let connection_promise = sequelize.authenticate().then(() => {
      for (const each_model_key of Object.keys(db_config[db_config_key]['models'])) {
        let models = {};
        let models_path = path.join(__dirname, 'models', db_config[db_config_key]['models'][each_model_key]);
        fs.readdirSync(
          models_path
        ).filter(file => {
          return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
        }).forEach(file => {
          let _model = require(path.join(models_path, file))(sequelize, Sequelize);
          models[_model.name] = _model;
        });

        Object.keys(models).forEach(modelName => {
          if (models[modelName].associate) {
            models[modelName].associate(models);
          }
        });

        models['sequelize'] = sequelize;
        db[each_model_key] = models;
      }
    }).catch((error) => {
      console.log(error);
      throw error;
    });

    all_connection_promises.push(connection_promise);
  }

  Promise.all(all_connection_promises).then(() => {
    application.set('models', db);
  });
}

function attach_routes(application) {
  application.use('/api/users', require('./routes/users'));
}

create_app();
