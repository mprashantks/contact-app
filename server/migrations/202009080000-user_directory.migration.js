"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("user_directory", {
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      display_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
      },
      password: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: true
      },
      google_user_id: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
      },
      google_token: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      profile_picture: {
        type: Sequelize.TEXT,
        allowNull: true
      },
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("user_directory");
  }
};
