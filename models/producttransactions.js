'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class productTransactions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  productTransactions.init({
    productId: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    transactionId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'productTransactions',
  });
  return productTransactions;
};