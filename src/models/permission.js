'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Permission extends Model {
    static associate(models) {
      
      Permission.belongsToMany(models.Role, {
        through: models.RolePermission,  
        foreignKey: 'permission_id',
        otherKey: 'role_id',
        as: 'roles'
      });
    }
  }

  Permission.init(
    {
      permission_id: {                 
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: 'Permission',
      tableName: 'Permissions',
      timestamps: true
    }
  );

  return Permission;
};
