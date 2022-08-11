'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OfficialLetter extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  OfficialLetter.init({
    UserId: DataTypes.INTEGER,
    from: DataTypes.STRING,
    to: DataTypes.STRING,
    date: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'OfficialLetter',
  });
  return OfficialLetter;
};