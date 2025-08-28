import db from "../models/index.js";
import { Op } from "sequelize";

export const scheduleAppointment = async (req, res) => {
  try {
    const user = req.user; 

    const { hospital_id, patient_id, doctor_id, appointment_time, duration_minutes } = req.body;

    if (!hospital_id || !patient_id || !doctor_id || !appointment_time) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    const userHospital = await db.UserHospital.findOne({
      where: { user_id: user.user_id, hospital_id },
    });

    if (!userHospital) {
      return res.status(403).json({ message: "You do not have access to this hospital" });
    }

    if (user.role !== "staff") {
      return res.status(403).json({ message: "Only staff can schedule appointments" });
    }

    const patient = await db.Patient.findOne({ where: { patient_id, hospital_id } });
    if (!patient) {
      return res.status(404).json({ message: "Patient not found in this hospital" });
    }

    const doctorHospital = await db.UserHospital.findOne({
      where: { user_id: doctor_id, hospital_id },
    });
    if (!doctorHospital) {
      return res.status(404).json({ message: "Doctor not found in this hospital" });
    }

    const existingAppointment = await db.Appointment.findOne({
      where: {
        hospital_id,
        doctor_id,
        appointment_time,
      },
    });

    if (existingAppointment) {
      return res.status(400).json({ message: "Doctor already has an appointment at this time" });
    }

    const appointment = await db.Appointment.create({
      hospital_id,
      patient_id,
      doctor_id,
      appointment_time,
      duration_minutes: duration_minutes || 30,
      created_by: user.user_id,
      status: "Scheduled",
    });

    return res.status(201).json({
      message: "Appointment scheduled successfully",
      data: appointment,
    });

  } catch (error) {
    console.error("Error scheduling appointment:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getAppointments = async (req, res) => {
  try {
    const user = req.user;
    const { hospital_id, doctor_id, patient_id, date } = req.query;

    if (!hospital_id) {
      return res.status(400).json({ message: "hospital_id is required" });
    }

    // Check if user has access to this hospital
    const userHospital = await db.UserHospital.findOne({
      where: { user_id: user.user_id, hospital_id },
    });

    if (!userHospital) {
      return res.status(403).json({ message: "You do not have access to this hospital" });
    }

    // Build query dynamically
    const whereClause = { hospital_id };

    if (doctor_id) whereClause.doctor_id = doctor_id;
    if (patient_id) whereClause.patient_id = patient_id;

    if (date) {
      // Filter by date (all appointments on that day)
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);

      whereClause.appointment_time = { [Op.between]: [start, end] };
    }

    const appointments = await db.Appointment.findAll({
      where: whereClause,
      include: [
        { model: db.Patient, attributes: ["name", "age", "gender", "contact"] },
        { model: db.User, as: "doctor", attributes: ["name"] },
      ],
      order: [["appointment_time", "ASC"]],
    });

    return res.status(200).json({ appointments });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};