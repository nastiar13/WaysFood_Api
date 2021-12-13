'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      users.hasMany(models.products, {
        as: "products",
        foreignKey: "userId"
      })
      users.hasMany(models.transactions, {
        as: "customerTransactions",
        foreignKey: "customerId"
      })
      users.hasMany(models.transactions, {
        as: "sellerTransactions",
        foreignKey: "sellerId"
      })
    }
  };
  users.init({
    fullName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    phone: DataTypes.STRING,
    gender: DataTypes.STRING,
    location: DataTypes.STRING,
    image: DataTypes.STRING,
    role: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'users',
  });
  return users;
};