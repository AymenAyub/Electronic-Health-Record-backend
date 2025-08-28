import db from "../models/index.js";

const DoctorAvailability = db.DoctorAvailability;

export const createAvailability = async (req, res) => {
  try {
    const { doctor_id, hospital_id, day_of_week, start_time, end_time } = req.body;

    const availability = await DoctorAvailability.create({
      doctor_id,
      hospital_id,
      day_of_week,
      start_time,
      end_time,
    });

    return res.status(201).json({
      message: "Availability created successfully",
      availability,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const getAvailabilities = async (req, res) => {
  try {
    const { hospital_id, doctor_id } = req.query;

    let where = {};
    if (hospital_id) where.hospital_id = hospital_id;
    if (doctor_id) where.doctor_id = doctor_id;

    const availabilities = await DoctorAvailability.findAll({ where });

    return res.status(200).json(availabilities);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const updateAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { day_of_week, start_time, end_time } = req.body;

    const availability = await DoctorAvailability.findByPk(id);
    if (!availability) {
      return res.status(404).json({ message: "Availability not found" });
    }

    availability.day_of_week = day_of_week || availability.day_of_week;
    availability.start_time = start_time || availability.start_time;
    availability.end_time = end_time || availability.end_time;

    await availability.save();

    return res.status(200).json({
      message: "Availability updated successfully",
      availability,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const deleteAvailability = async (req, res) => {
  try {
    const { id } = req.params;

    const availability = await DoctorAvailability.findByPk(id);
    if (!availability) {
      return res.status(404).json({ message: "Availability not found" });
    }

    await availability.destroy();

    return res.status(200).json({ message: "Availability deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
