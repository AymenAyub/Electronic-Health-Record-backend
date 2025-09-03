import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class DoctorAvailability extends Model {
    static associate(models) {
      DoctorAvailability.belongsTo(models.User, {
        foreignKey: "doctor_id",
        as: "doctor",
      });

      // optional: agar hospital bhi associate karna hai
      DoctorAvailability.belongsTo(models.Hospital, {
        foreignKey: "hospital_id",
        as: "hospital",
      });
    }
  }

  DoctorAvailability.init(
    {
      availability_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      doctor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      hospital_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      day_of_week: {
        type: DataTypes.INTEGER, // 0 = Sunday, 1 = Monday, ...
        allowNull: false,
      },
      start_time: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      end_time: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      slot_duration: {
        type: DataTypes.INTEGER,
        defaultValue: 30, // minutes
      },
    },
    {
      sequelize,
      modelName: "DoctorAvailability",
      tableName: "DoctorAvailability",
    }
  );

  return DoctorAvailability;
};
