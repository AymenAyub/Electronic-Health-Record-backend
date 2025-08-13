'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('Patients', {
    patient_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    hospital_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Hospitals',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    age: {
      type: Sequelize.INTEGER,
    },
    gender: {
      type: Sequelize.STRING,
    },
    contact: {
      type: Sequelize.STRING,
    },
    CNIC: {
      type: Sequelize.STRING,
      unique: true,
    },
    guardian_info: {
      type: Sequelize.STRING,
    },
    address: {
      type: Sequelize.TEXT,
    },
    emergency_contact: {
      type: Sequelize.STRING,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn('NOW'),
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn('NOW'),
    },
  });
}
 export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('Patients');
}

