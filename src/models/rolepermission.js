'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class RolePermission extends Model {
    static associate(models) {
      // Relations are already handled in Role & Permission models
      // But you can still add belongsTo for clarity if you want:
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
          model: 'Role',
          key: 'role_id'
        },
        onDelete: 'CASCADE'
      },
      permission_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Permission',
          key: 'permission_id'
        },
        onDelete: 'CASCADE'
      }
    },
    {
      sequelize,
      modelName: 'RolePermission',
      tableName: 'RolePermissions',
      timestamps: false, 
    }
  );

  return RolePermission;
};
