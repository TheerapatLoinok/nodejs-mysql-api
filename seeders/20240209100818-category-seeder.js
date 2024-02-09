"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("categories", [
      {
        name: "NodeJs",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "ReactJs",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "VueJs",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Laravel",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("categories", {}, null);
  },
};
