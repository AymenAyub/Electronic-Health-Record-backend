'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class RolePermission extends Model {
    static associate(models) {
      // junction table so relations are handled in Role & Permission models
    }
  }

  RolePermission.init(
    {
      role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      permission_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'RolePermission',
      tableName: 'RolePermissions',
    }
  );

  return RolePermission;
};
