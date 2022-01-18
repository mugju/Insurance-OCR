const Sequelize = require('sequelize');

module.exports = class Upload extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      content: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      img: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },
    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'Upload',
      tableName: 'uploads',
      paranoid: false,
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    });
  }

  static associate(db) {
    db.Upload.belongsTo(db.User);
    db.Upload.belongsToMany(db.Tag, { through: 'UploadTag' });
  }
};