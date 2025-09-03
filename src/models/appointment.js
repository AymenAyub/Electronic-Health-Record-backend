'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Appointment extends Model {
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

      Appointment.belongsTo(models.User, {
        foreignKey: 'created_by',
        as: 'Receptionist',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      });

      Appointment.hasOne(models.VisitNote, {
        foreignKey: 'appointment_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      Appointment.hasOne(models.Payment, {
        foreignKey: 'appointment_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      Appointment.belongsTo(models.Hospital, {
        foreignKey: 'hospital_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }

  Appointment.init(
    {
      appointment_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      hospital_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      patient_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      doctor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      appointment_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      start_time: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      end_time: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('Scheduled', 'Completed', 'Cancelled'),
        defaultValue: 'Scheduled',
      },
      created_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Appointment',
      tableName: 'Appointments',
      timestamps: true,
    }
  );

  return Appointment;
};
