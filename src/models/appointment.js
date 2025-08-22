'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Appointment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Appointment.belongsTo(models.Patient, {
        foreignKey: 'patient_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

       Appointment.belongsTo(models.User, {
        foreignKey: 'doctor_id',
        as: 'Doctor',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      // Appointment has one VisitNote
      Appointment.hasOne(models.VisitNote, {
        foreignKey: 'appointment_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });

      // Appointment has one Payment
      Appointment.hasOne(models.Payment, {
        foreignKey: 'appointment_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    
    }
  }
  Appointment.init(
    {
    appointment_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      patient_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      doctor_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      appointment_time: {
        type: DataTypes.DATE,
        allowNull: false
      },
      status: {
        type: DataTypes.ENUM('Scheduled', 'Completed', 'Cancelled'),
        defaultValue: 'Scheduled'
      }
    },
    {
      sequelize,
      modelName: 'Appointment',
      tableName: 'Appointments', // same as migration table name
      timestamps: true
    }
  );
  return Appointment;
};