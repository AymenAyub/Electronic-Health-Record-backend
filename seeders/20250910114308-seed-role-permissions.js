'use strict';

export async function up(queryInterface, Sequelize) {
  const [roles] = await queryInterface.sequelize.query(`SELECT role_id, name FROM Roles;`);
  const [permissions] = await queryInterface.sequelize.query(`SELECT permission_id, name FROM Permissions;`);

  const roleMap = Object.fromEntries(roles.map(r => [r.name, r.role_id]));
  const rolePermissions = [];
  for (const p of permissions) {
    const existingRP = await queryInterface.rawSelect('RolePermissions', {
      where: { role_id: roleMap['Owner'], permission_id: p.permission_id }
    }, ['id']);

    if (!existingRP) {
      rolePermissions.push({
        role_id: roleMap['Owner'],
        permission_id: p.permission_id,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  }

  if (rolePermissions.length > 0) {
    await queryInterface.bulkInsert('RolePermissions', rolePermissions);
  }
}


export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete('RolePermissions', null, {});
}
