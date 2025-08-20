'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Permission extends Model {
    static associate(models) {
     
      Permission.belongsToMany(models.Role, {
        through: models.RolePermissions,
        foreignKey: 'permission_id',
        otherKey: 'role_id',
        as:'roles'
      });
    }
  }

  Permission.init(
    {
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
      tableName: 'Permissions'
    }
  );

  return Permission;
};
