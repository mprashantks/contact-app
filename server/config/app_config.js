const path = require('path');
const fs = require('fs');

function get_logger_config(log_path) {
  return {
    file: {
      level: 'info',
      filename: path.join(log_path, 'app.log'),
      handleExceptions: true,
      json: true,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      colorize: true
    },
    console: {
      level: 'debug',
      handleExceptions: true,
      json: false,
      colorize: true,
    }
  };
}

class Config {
  constructor() {
    this.SECRET_KEY = process.env.SECRET_KEY || 'contacts-app';
    this.APP_PORT = process.env.NODE_APP_PORT || 4000;
    this.APP_URL = 'http://127.0.0.1:4000';
    this.GOOGLE_OAUTH2_SCOPE = [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/contacts'
    ];
  }
}

class ProductionConfig extends Config {
  constructor() {
    super();
    this.APP_ENV = 'production';

    this.LOG_PATH = path.join(process.env.LOG_DIR, process.env.NODE_APP_SRC);
    this.LOGGING_CONFIG = get_logger_config(this.LOG_PATH);

    // DB creds to connect to various data sources
    this.DB_CRED = {
      db: {
        cred: {
          dialect: process.env.DB_DIALECT,
          username: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          host: process.env.DB_HOST,
          port: process.env.DB_PORT,
          database: process.env.DB_DATABASE
        }, models: {
          app_db: 'app_models',
        }
      }
    };

    this.GOOGLE_OAUTH2_CLIENT_ID = process.env.GOOGLE_OAUTH2_CLIENT_ID;
    this.GOOGLE_OAUTH2_CLIENT_SECRET = process.env.GOOGLE_OAUTH2_CLIENT_SECRET;
  }
}

class DevelopmentConfig extends Config {
  constructor() {
    super();
    this.APP_ENV = 'development';

    this.LOG_PATH = 'D:\\workspace\\ContactsApp_Data\\log\\node-app';
    this.LOGGING_CONFIG = get_logger_config(this.LOG_PATH);

    this.DB_CRED = {
      db: {
        cred: {
          dialect: 'mysql',
          username: 'root',
          password: 'root',
          host: 'localhost',
          port: 3306,
          database: 'contacts_app'
        }, models: {
          app_db: 'app_models',
        }
      }
    };

    this.GOOGLE_OAUTH2_CLIENT_ID = '94619940837-4lp8j09rduc1m2e4t15qhq65hpivgubu.apps.googleusercontent.com';
    this.GOOGLE_OAUTH2_CLIENT_SECRET = 'wZYtceqlG-0cDc1-YAJqjCCi';
    this.GOOGLE_OAUTH2_REDIRECT_URL = 'http://localhost:3000'
  }
}

class TestingConfig extends Config {
  constructor() {
    super();
    this.APP_ENV = 'testing';

    this.LOG_PATH = 'D:\\workspace\\ContactsApp_Data\\log\\node-app';
    this.LOGGING_CONFIG = get_logger_config(this.LOG_PATH);
  }
}

module.exports = {
  production: ProductionConfig,
  development: DevelopmentConfig,
  testing: TestingConfig
};
