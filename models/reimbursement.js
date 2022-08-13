"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Reimbursement extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Reimbursement.belongsTo(models.OfficialLetter, {
        foreignKey: "OfficialLetterId",
      });
    }
  }
  Reimbursement.init(
    {
      OfficialLetterId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "Please select your official letter" },
          notEmpty: { msg: "Please select your official letter" },
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: { msg: "Please insert reimbursement description" },
          notEmpty: { msg: "Please insert reimbursement description" },
        },
      },
      cost: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "Please insert requested amount" },
          notEmpty: { msg: "Please insert requested amount" },
        },
      },
      image: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Please upload proof of transaction" },
          notEmpty: { msg: "Please upload proof of transaction" },
        },
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Please insert category type" },
          notEmpty: { msg: "Please insert category type" },
        },
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "Pending",
      },
      updatedBy: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "-",
      },
    },
    {
      sequelize,
      modelName: "Reimbursement",
    }
  );
  return Reimbursement;
};
