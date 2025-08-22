'use strict';
/**
 * @type {import('sequelize-cli').Migration}
 */
export async function up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      user_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      hospital_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Hospitals', // exact table name
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      // role_id: {
      //   type: Sequelize.INTEGER,
      //   allowNull: false,
      //   references: {
      //     model: 'Roles',
      //     key: 'role_id',
      //   },
      //   onUpdate: 'CASCADE',
      //   onDelete: 'CASCADE', 
      // },      
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      role: {
        type: Sequelize.ENUM('admin', 'doctor', 'staff'),
        allowNull: false,
      },
      designation: {
        type: Sequelize.STRING,
        allowNull: true, 
      },
      specialty: {
        type: Sequelize.STRING,
        allowNull: true, // only for doctors
      },
      bio: {
        type: Sequelize.TEXT,
        allowNull: true, // only for doctors
      },
      contact: {
        type: Sequelize.STRING,
        allowNull: true, // only for doctors
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
  }

  export async function down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }

