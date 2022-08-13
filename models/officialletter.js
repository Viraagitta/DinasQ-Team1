"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class OfficialLetter extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      OfficialLetter.belongsTo(models.User, {
        foreignKey: "UserId",
      });
      OfficialLetter.hasMany(models.Reimbursement, {
        foreignKey: "OfficialLetterId",
      });
    }
  }
  OfficialLetter.init(
    {
      UserId: DataTypes.INTEGER,
      activityName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Please insert activity name" },
          notEmpty: { msg: "Please insert activity name" },
        },
      },
      from: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Please insert your origin" },
          notEmpty: { msg: "Please insert your origin" },
        },
      },
      to: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Please insert destination" },
          notEmpty: { msg: "Please insert destination" },
        },
      },
      leaveDate: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Please insert leave date" },
          notEmpty: { msg: "Please insert leave date" },
        },
      },
      returnDate: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Please insert return date" },
          notEmpty: { msg: "Please insert return date" },
        },
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: "Pending",
      },
    },
    {
      sequelize,
      modelName: "OfficialLetter",
    }
  );
  return OfficialLetter;
};
