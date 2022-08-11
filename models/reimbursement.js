'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Reimbursement extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Reimbursement.init({
    OfficialLetterId: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    cost: DataTypes.INTEGER,
    image: DataTypes.STRING,
    category: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Reimbursement',
  });
  return Reimbursement;
};