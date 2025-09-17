'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {

      User.hasMany(models.DoctorAvailability, {
        foreignKey: "doctor_id",
        as: "availabilities"
      });

      User.hasMany(models.UserHospital, {
        foreignKey: 'user_id',
        as: 'userHospitals',
      });

      User.hasMany(models.Appointment,
         { as: "ReceptionistAppointments", 
          foreignKey: "created_by" 
        });
      

      User.hasMany(models.Appointment, {
        foreignKey: 'doctor_id',
        as: 'DoctorAppointments',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

    //   User.belongsTo(models.Role, {
    //   foreignKey: 'role_id',
    //   as: 'role',
    // });


    }
  }

  User.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      // role_id: {
      //   type: DataTypes.INTEGER,
      //   allowNull: false,
      // },

      designation: {
        type: DataTypes.STRING,
        allowNull: true, 
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      specialty: {
        type: DataTypes.STRING,
        allowNull: true, 
      },
      bio: {
        type: DataTypes.TEXT,
        allowNull: true, 
      },
      contact: {
        type: DataTypes.STRING,
        allowNull: true, 
      },
      
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'Users',
      timestamps: true,
    }
  );

  return User;
};
