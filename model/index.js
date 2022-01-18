'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};


const Upload = require('./upload');
const User = require('./user');
const Admin = require('./admin');
const Tag = require('./tag');

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

db.sequelize = sequelize;
db.User = User;
db.Upload = Upload;
db.Tag = Tag;
db.Admin = Admin;

User.init(sequelize);
Upload.init(sequelize);
Tag.init(sequelize);
Admin.init(sequelize);

User.associate(db);
Upload.associate(db);
Tag.associate(db);
Admin.associate(db);

module.exports = db;