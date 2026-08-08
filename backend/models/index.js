const sequelize = require('../config/database');
const User = require('./User');
const Supplier = require('./Supplier');
const Product = require('./Product');

// Associations: One Supplier has many Products, Product belongs to Supplier
Supplier.hasMany(Product, { foreignKey: 'supplierId', onDelete: 'CASCADE' });
Product.belongsTo(Supplier, { foreignKey: 'supplierId' });

module.exports = {
  sequelize,
  User,
  Supplier,
  Product
};
