'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Payment extends Model {
    static associate(models) {
      // Payment belongs to one Appointment
      Payment.belongsTo(models.Appointment, {
        foreignKey: 'appointment_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      // Payment belongs to one Patient
      Payment.belongsTo(models.Patient, {
        foreignKey: 'patient_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      Payment.belongsTo(models.Hospital, {
        foreignKey: 'hospital_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }

  Payment.init(
    {
      payment_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      patient_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      appointment_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      hospital_id: {           
        type: DataTypes.INTEGER,
        allowNull: false
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      method: {
        type: DataTypes.ENUM('Cash', 'Card', 'Online'),
        allowNull: false
      },
      status: {
        type: DataTypes.ENUM('Paid', 'Unpaid', 'Pending'),
        allowNull: false,
        defaultValue: 'Pending'
      }
    },
    {
      sequelize,
      modelName: 'Payment',
      tableName: 'Payments',
      timestamps: true
    }
  );

  return Payment;
};
