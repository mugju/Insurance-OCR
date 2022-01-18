const Sequelize = require('sequelize');

module.exports = class Admin extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      id: { //admin
        type: Sequelize.STRING(40),
        allowNull: true,
        unique: true,
      },
      Kname: {  //한국이름
        type: Sequelize.STRING(15),
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      
    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'Admin',
      tableName: 'admins',
      paranoid: true,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }

  static associate(db) {
    db.Admin.hasMany(db.User,{foreignKey:'manager',sourceKey:'Kname'});
  }
};