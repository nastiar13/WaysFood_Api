'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class transactions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      transactions.belongsTo(models.users, {
        as: "customer",
        foreignKey: "customerId"
      })
      transactions.belongsTo(models.users, {
        as: "seller",
        foreignKey: "sellerId"
      })
      transactions.belongsToMany(models.products, {
        as: "products",
        through : {
          model: "productTransactions",
          as: "bridge"
        },
        foreignKey: "transactionId"
      })
      
    }
  };
  transactions.init({
    status: DataTypes.STRING,
    customerId: DataTypes.INTEGER,
    sellerId: DataTypes.INTEGER,
    quantityProduct: DataTypes.INTEGER,
    productId: DataTypes.INTEGER,
    totalPrice: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'transactions',
  });
  return transactions;
};