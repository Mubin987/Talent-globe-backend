'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
require('dotenv').config();
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const db = {};

let sequelize;
if (process.env.USE_ENV_VARIABLE) {
  sequelize = new Sequelize(process.env[process.env.USE_ENV_VARIABLE], {
    dialect: 'mysql',
  });
} else {
  sequelize = new Sequelize({
    database: process.env.MYSQLDATABASE,
    username: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    host: process.env.MYSQLHOST,
    port: process.env.MYSQLPORT,
    dialect: 'mysql',
  });
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
