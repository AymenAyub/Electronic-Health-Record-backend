'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class VisitNote extends Model {
    static associate(models) {
      //VisitNote belongs to one Appointment
      VisitNote.belongsTo(models.Appointment, {
        foreignKey: 'appointment_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      // VisitNote belongs to one Patient
      VisitNote.belongsTo(models.Patient, {
        foreignKey: 'patient_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      VisitNote.belongsTo(models.Hospital, {
        foreignKey: 'hospital_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }

  VisitNote.init(
    {
      note_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      appointment_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      patient_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      hospital_id: {             
        type: DataTypes.INTEGER,
        allowNull: false
      },
      symptoms: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      diagnosis: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      prescribed_treatment: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: 'VisitNote',
      tableName: 'VisitNotes',
      timestamps: true
    }
  );

  return VisitNote;
};
