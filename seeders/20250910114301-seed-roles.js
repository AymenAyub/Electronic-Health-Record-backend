'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.bulkInsert('Roles', [
    {
      name: 'Owner',
      description: 'Full access to all features',
      hospital_id: null, 
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete('Roles', null, {});
}
