const { Sequelize } = require('sequelize');
const config = require('../config/database');

const sequelize = new Sequelize(config.url, config.options);

const db = {
  sequelize,
  Sequelize,
};

// Load models
db.Url = require('./url.model')(sequelize, Sequelize);
db.Admin = require('./admin.model')(sequelize, Sequelize);

module.exports = db;