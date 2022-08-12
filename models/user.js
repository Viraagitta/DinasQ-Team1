"use strict";
const { Model } = require("sequelize");
const { hashPassword } = require("../helpers/bcrypt");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init(
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Please insert first name" },
          notEmpty: { msg: "Please insert first name" },
        },
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Please insert last name" },
          notEmpty: { msg: "Please insert last name" },
        },
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Please insert user role" },
          notEmpty: { msg: "Please insert user role" },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notNull: { msg: "Please insert email" },
          notEmpty: { msg: "Please insert email" },
          isEmail: { args: true, msg: "Invalid email format" },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Please insert password" },
          notEmpty: { msg: "Please insert password" },
          len: {
            args: [5, 32],
            msg: "Minimum password length is five characters",
          },
        },
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Please insert user phone number" },
          notEmpty: { msg: "Please insert user phone number" },
          len: { args: [10, 12], msg: "Please insert correct phone number" },
        },
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Please insert user address" },
          notEmpty: { msg: "Please insert user address" },
        },
      },
      position: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Please insert user position" },
          notEmpty: { msg: "Please insert user position" },
        },
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  User.beforeCreate((instance, options) => {
    instance.password = hashPassword(instance.password, 10);
  });
  return User;
};
