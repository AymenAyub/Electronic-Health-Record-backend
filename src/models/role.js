'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Role extends Model {
    static associate(models) {
      Role.belongsTo(models.Hospital, {
        foreignKey: 'hospital_id',
        as: 'hospital'
      });
      
      Role.hasMany(models.UserHospital, {
      foreignKey: 'role_id',
      as: 'userHospitals',
    });


      Role.belongsToMany(models.Permission, {
        through: models.RolePermission,
        foreignKey: 'role_id',
        otherKey: 'permission_id',
        as: 'permissions'
      });
    }
  }

  Role.init(
    {
      role_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      hospital_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'Hospitals',
          key: 'id',
        }
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: 'Role',
      tableName: 'Roles',
      timestamps: true
    }
  );

  return Role;
};
