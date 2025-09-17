'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class UserHospital extends Model {
    static associate(models) {
      UserHospital.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
      });

      UserHospital.belongsTo(models.Hospital, {
        foreignKey: 'hospital_id',
        as: 'hospital',
      });

      UserHospital.belongsTo(models.Role, {
        foreignKey: 'role_id',
        as: 'role',
      });
    }
  }

  UserHospital.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      hospital_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'UserHospital',
      tableName: 'UserHospitals',
      timestamps: true,
    }
  );

  return UserHospital;
};
