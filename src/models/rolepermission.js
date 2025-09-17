'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class RolePermission extends Model {
    static associate(models) {
      
      RolePermission.belongsTo(models.Role, {
        foreignKey: 'role_id',
        as: 'role'
      });

      RolePermission.belongsTo(models.Permission, {
        foreignKey: 'permission_id',
        as: 'permission'
      });
    }
  }

  RolePermission.init(
    {
      role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Roles',
          key: 'role_id'
        },
        onDelete: 'CASCADE'
      },
      permission_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Permissions',
          key: 'permission_id'
        },
        onDelete: 'CASCADE'
      }
    },
    {
      sequelize,
      modelName: 'RolePermission',
      tableName: 'RolePermissions',
      timestamps: true, 
    }
  );

  return RolePermission;
};
