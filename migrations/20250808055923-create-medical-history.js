'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('MedicalHistories', {
    history_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    patient_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Patients',
        key: 'patient_id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    past_illnesses: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    diagnosis: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    prescriptions: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn('NOW')
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn('NOW')
    }
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('MedicalHistories');
}

