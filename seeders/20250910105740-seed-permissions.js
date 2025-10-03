'use strict';

export async function up(queryInterface, Sequelize) {
  const permissions = [
    { name: 'add_hospital', description: 'Can add a new hospital' },
    { name: 'add_user', description: 'Can add new users' },
    { name: 'edit_user', description: 'Can edit existing users' },
    { name: 'delete_user', description: 'Can delete users' },
    { name: 'view_users', description: 'Can view all users' },
    { name: 'add_patient', description: 'Can add new patients' },
    { name: 'edit_patient', description: 'Can edit patient info' },
    { name: 'view_patients', description: 'Can view patients' },
    { name: 'add_appointment', description: 'Can schedule appointments' },
    { name: 'edit_appointment', description: 'Can edit appointments' },
    { name: 'view_appointments', description: 'Can view appointments' },
    { name: 'add_availability', description: 'Can set doctor availability' },
    { name: 'edit_availability', description: 'Can edit doctor availability' },
    { name: 'delete_availability', description: 'Can delete doctor availability' },
    { name: 'view_availability', description: 'Can view doctor availability' },
    { name: 'add_medical_history', description: 'Can add medical history of patients' },
    { name: 'edit_medical_history', description: 'Can edit medical history' },
    { name: 'delete_medical_history', description: 'Can delete medical history' },
    { name: 'view_medical_history', description: 'Can view patient medical history' },
    { name: 'add_role', description: 'Can add new roles' },
    { name: 'edit_role', description: 'Can edit roles' },
    { name: 'view_roles', description: 'Can view roles' },
    { name: 'delete_role', description: 'Can delete roles' },
     { name: 'view_dashboard', description: 'Can view dashboard' },
    { name: 'view_settings', description: 'Can view settings' },
  ]

  const insertData = [];
  for (const permission of permissions) {
    const existing = await queryInterface.rawSelect(
      'Permissions',
      { where: { name: permission.name } },
      ['permission_id']
    );

    if (!existing) {
      insertData.push({
        ...permission,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  }

  if (insertData.length > 0) {
    await queryInterface.bulkInsert('Permissions', insertData);
  }
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete('Permissions', null, {});
}
