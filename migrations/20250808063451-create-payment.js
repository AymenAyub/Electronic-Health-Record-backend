'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('Payments', {
    payment_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    patient_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Patients',
        key: 'patient_id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    hospital_id: {  
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Hospitals',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    appointment_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Appointments',
        key: 'appointment_id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    amount: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false
    },
    method: {
     type: Sequelize.ENUM('Cash', 'Card', 'Online'),
     allowNull: false
},
    status: {
    type: Sequelize.ENUM('Paid', 'Unpaid', 'Pending'),
    allowNull: false,
    defaultValue: 'Pending'
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
  await queryInterface.dropTable('Payments');
}


