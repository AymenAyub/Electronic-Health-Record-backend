'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Hospital extends Model {
    static associate(models) {
      // 1 Hospital → Many Patients
      Hospital.hasMany(models.Patient, {
        foreignKey: 'hospital_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }

  Hospital.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      subdomain: DataTypes.STRING,
      phone: DataTypes.STRING,
      address: DataTypes.STRING,
      isActive: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'Hospital',
      tableName: 'Hospitals',
      timestamps: true, // for createdAt, updatedAt
    }
  );

  return Hospital;
};
