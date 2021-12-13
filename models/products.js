'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class products extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      products.belongsTo(models.users, {
        as: "owner",
        foreignKey: "userId"
      })

      products.belongsToMany(models.transactions, {
        as: "products",
        through: {
          model: "productTransactions",
          as: "bridge"
        },
        foreignKey: "productId"
      })
    }
  };
  products.init({
    productName: DataTypes.STRING,
    description: DataTypes.TEXT,
    quantity: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    image: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'products',
  });
  return products;
};