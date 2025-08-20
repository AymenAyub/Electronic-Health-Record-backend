'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('RolePermissions', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    role_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Roles',
        key: 'role_id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    permission_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Permissions',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn('NOW'),
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn('NOW'),
    },
  });

  await queryInterface.addConstraint('RolePermissions', {
    fields: ['role_id', 'permission_id'],
    type: 'unique',
    name: 'unique_role_permission',
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('RolePermissions');
}
