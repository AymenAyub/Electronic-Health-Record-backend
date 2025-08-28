'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('DoctorAvailability', {
    availability_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    doctor_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'user_id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    hospital_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Hospitals', 
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    day_of_week: {
      type: Sequelize.TINYINT, // 0 = Sunday, 1 = Monday, ... 6 = Saturday
      allowNull: false,
    },
    start_time: {
      type: Sequelize.TIME,
      allowNull: false,
    },
    end_time: {
      type: Sequelize.TIME,
      allowNull: false,
    },
    slot_duration: {
      type: Sequelize.INTEGER, // in minutes (e.g., 15, 20, 30)
      defaultValue: 30,
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
    }
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('DoctorAvailability');
}
