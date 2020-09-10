module.exports = (sequelize, DataTypes) => {
  return sequelize.define("user_directory", {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    display_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    google_user_id: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    google_token: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    profile_picture: {
      type: DataTypes.TEXT,
      allowNull: true
    },
  }, {
    timestamps: false, freezeTableName: true, tableName: 'user_directory'
  });
};
