'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class SuperAdmin extends Model {
    static associate(models) {
    }
  }

  SuperAdmin.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'SuperAdmin',
      tableName: 'SuperAdmins',
      timestamps: true
    }
  );

  return SuperAdmin;
};
