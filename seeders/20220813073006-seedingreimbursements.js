"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const data = require("../data/data.json").reimbursements;
    data.forEach((el) => {
      el.createdAt = new Date();
      el.updatedAt = new Date();
    });
    await queryInterface.bulkInsert("Reimbursements", data);
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Reimbursements");
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
