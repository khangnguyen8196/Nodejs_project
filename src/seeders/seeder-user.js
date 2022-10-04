'use strict';

module.exports = {


  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      email: 'admin@gmail.com',
      password:'123456',
      firstName: 'John',
      lastName: 'Doe',
      address: 'USA',
      gender: '1',
      roleId: 'ROLE',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});

  }
};
