const path = require('path');
const { Sequelize } = require('sequelize');

// Initialize SQLite database using Sequelize
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../database.sqlite'),
  logging: false // Set to console.log to debug SQL queries if needed
});

module.exports = sequelize;
