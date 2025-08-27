'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Hospital extends Model {
    static associate(models) {

      // Hospital.belongsToMany(models.User, {
      //   through: models.UserHospital,
      //   foreignKey: 'hospital_id',
      //   otherKey: 'user_id',
      //   as: 'users',
      // });
      
      Hospital.hasMany(models.UserHospital, {
        foreignKey: 'hospital_id',
        as: 'userHospitals',
      });
      
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
      name: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      subdomain: { type: DataTypes.STRING, allowNull: false, unique: true }, // <- clarity
      phone: { type: DataTypes.STRING, allowNull: true },
      address: { type: DataTypes.TEXT, allowNull: true },
      isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    },
    {
      sequelize,
      modelName: 'Hospital',
      tableName: 'Hospitals',
      timestamps: true, 
    }
  );

  return Hospital;
};
