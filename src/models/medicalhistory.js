'use strict';

import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class MedicalHistory extends Model {
    static associate(models) {
      MedicalHistory.belongsTo(models.Patient, {
        foreignKey: 'patient_id'
      });
    }
  }
  MedicalHistory.init({
    history_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    patient_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    past_illnesses: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    diagnosis:{
      type: DataTypes.TEXT,
      allowNull: true
    },
    prescriptions:{ 
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'MedicalHistory',
    tableName: 'MedicalHistories'
  });
  return MedicalHistory;
};
