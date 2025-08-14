'use strict';

import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class Patient extends Model {
    static associate(models) {
       // 1. Patient belongs to Hospital (Many patients → 1 hospital)
      Patient.belongsTo(models.Hospital, {
        foreignKey: 'hospital_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });

      // 2. Patient has one MedicalHistory
      Patient.hasOne(models.MedicalHistory, {
        foreignKey: 'patient_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });

      // 3. Patient has many Appointments
      Patient.hasMany(models.Appointment, {
        foreignKey: 'patient_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });

      // 4. Patient has many VisitNotes
      Patient.hasMany(models.VisitNote, {
        foreignKey: 'patient_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });

      // 5. Patient has many Payments
      Patient.hasMany(models.Payment, {
        foreignKey: 'patient_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  }
  Patient.init({
    patient_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      hospital_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      age: {
        type: DataTypes.INTEGER
      },
      gender: {
        type: DataTypes.STRING
      },
      contact: {
        type: DataTypes.STRING
      },
      CNIC: {
        type: DataTypes.STRING,
        unique: true
      },
      guardian_info: {
        type: DataTypes.STRING
      },
      address: {
        type: DataTypes.TEXT
      },
      emergency_contact: {
        type: DataTypes.STRING
      }
  }, {
    sequelize,
    modelName: 'Patient',
    tableName: 'Patients', // same as migration table name
    timestamps: true // enables createdAt and updatedAt fields
  });
  return Patient;
};