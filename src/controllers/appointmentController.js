import db from "../models/index.js";
import { Op } from "sequelize";

const Appointment = db.Appointment;
const DoctorAvailability = db.DoctorAvailability;
const Patient = db.Patient;
const User = db.User;

export const scheduleAppointment = async (req, res) => {
  try {
    const user=req.user;
    const { hospital_id, patient_id, doctor_id, appointment_date, start_time } = req.body;

    const patient = await Patient.findByPk(patient_id);
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    const doctor = await User.findByPk(doctor_id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    const [hours, minutes, seconds] = start_time.split(":").map(Number);
    const startDateTime = new Date(appointment_date);
    startDateTime.setHours(hours, minutes, seconds || 0, 0);

   

    if (startDateTime < new Date()) {
    return res.status(400).json({ message: "Cannot book an appointment in the past" });
  }

    const dayOfWeek = startDateTime.getDay();
    const availability = await DoctorAvailability.findOne({
      where: { doctor_id, day_of_week: dayOfWeek },
    });
    if (!availability) return res.status(400).json({ message: "Doctor not available on this day" });

    
    const duration_minutes = availability.slot_duration || 30;
    const endDateTime = new Date(startDateTime.getTime() + (duration_minutes || 30) * 60000);

    const end_time = endDateTime.toTimeString().split(" ")[0]; 

    const slotMinutes = startDateTime.getMinutes() % duration_minutes;
    if (slotMinutes !== 0) {
      return res.status(400).json({ message: `Appointment must align with ${duration_minutes}-minute slots` });
    }

    const conflict = await Appointment.findOne({
      where: {
        doctor_id,
        appointment_date,
        [Op.or]: [
          {
            start_time: {
              [Op.between]: [
                startDateTime.toTimeString().split(" ")[0],
                endDateTime.toTimeString().split(" ")[0]
              ]
            }
          },
          {
            end_time: {
              [Op.between]: [
                startDateTime.toTimeString().split(" ")[0],
                endDateTime.toTimeString().split(" ")[0]
              ]
            }
          },
          {
            [Op.and]: [
              { start_time: { [Op.lte]: startDateTime.toTimeString().split(" ")[0] } },
              { end_time: { [Op.gte]: endDateTime.toTimeString().split(" ")[0] } }
            ]
          }
        ]
      }
    });
    
    if (conflict) return res.status(400).json({ message: "Doctor already booked at this time" });

    const newAppointment = await Appointment.create({
      hospital_id,
      patient_id,
      doctor_id,
      appointment_date,
      start_time,
      end_time,
      created_by: user.user_id,
      status: "Scheduled",
    });

    res.status(201).json({ message: "Appointment created successfully", data: newAppointment });

  } catch (error) {
    console.error("Error creating appointment:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const getAppointments = async (req, res) => {
  try {
    const user = req.user;
    const hospital_id = Number(req.query.hospital_id);
    console.log("Query params:", req.query);

    if (!hospital_id) {
      return res.status(400).json({ message: "hospital_id is required" });
    }

    const appointments = await Appointment.findAll({
      where: { hospital_id },
      include: [
        {
          model: Patient,
          attributes: ["patient_id", "name"],
        },
        {
          model: User,
          as: "Doctor",
          attributes: ["user_id", "name"],
        },
      ],
      order: [["appointment_date", "ASC"], ["start_time", "ASC"]],
    });

    const formatted = appointments.map((apt) => ({
      id: apt.appointment_id,
      appointment_date: apt.appointment_date,
      start_time: apt.start_time,
      end_time: apt.end_time,
      status: apt.status,
      patient_id: apt.patient_id,
      patient_name: apt.Patient?.name || "Unknown",
      doctor_id: apt.doctor_id,
      doctor_name: apt.Doctor?.name || "Unknown",
    }));

    res.status(200).json({ message: "Appointments fetched successfully", appointments: formatted });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { appointment_date, start_time, doctor_id, patient_id, status } = req.body;

    console.log(appointmentId)
     if (!appointmentId) {
      return res.status(404).json({ message: "No appointment Id" });
    }

    const appointment = await Appointment.findByPk(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    const doctor = await User.findByPk(doctor_id || appointment.doctor_id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    if (patient_id) {
      const patient = await Patient.findByPk(patient_id);
      if (!patient) return res.status(404).json({ message: "Patient not found" });
    }

    if (status) {
      const allowedStatuses = ["Scheduled", "Completed", "Cancelled"];
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid status value" });
      }
      appointment.status = status;
    }

 
    if (appointment_date && start_time) {
      const [hours, minutes, seconds] = start_time.split(":").map(Number);
      const startDateTime = new Date(appointment_date);
      startDateTime.setHours(hours, minutes, seconds || 0, 0);

      const dayOfWeek = startDateTime.getDay();
      const availability = await DoctorAvailability.findOne({
        where: { doctor_id: doctor_id || appointment.doctor_id, day_of_week: dayOfWeek },
      });
      if (!availability) {
        return res.status(400).json({ message: "Doctor not available on this day" });
      }

      const duration_minutes = availability.slot_duration || 30;
      const endDateTime = new Date(startDateTime.getTime() + duration_minutes * 60000);
      const end_time = endDateTime.toTimeString().split(" ")[0];

      const slotMinutes = startDateTime.getMinutes() % duration_minutes;
      if (slotMinutes !== 0) {
        return res.status(400).json({ message: `Appointment must align with ${duration_minutes}-minute slots` });
      }

      const conflict = await Appointment.findOne({
        where: {
          doctor_id: doctor_id || appointment.doctor_id,
          appointment_date,
          appointment_id: { [Op.ne]: appointmentId }, 
          status: { [Op.ne]: "Cancelled" },
          [Op.or]: [
            {
              start_time: {
                [Op.between]: [
                  startDateTime.toTimeString().split(" ")[0],
                  endDateTime.toTimeString().split(" ")[0]
                ]
              }
            },
            {
              end_time: {
                [Op.between]: [
                  startDateTime.toTimeString().split(" ")[0],
                  endDateTime.toTimeString().split(" ")[0]
                ]
              }
            },
            {
              [Op.and]: [
                { start_time: { [Op.lte]: startDateTime.toTimeString().split(" ")[0] } },
                { end_time: { [Op.gte]: endDateTime.toTimeString().split(" ")[0] } }
              ]
            }
          ]
        }
      });

      if (conflict) {
        return res.status(400).json({ message: "Doctor already booked at this time" });
      }
      appointment.appointment_date = appointment_date;
      appointment.start_time = start_time;
      appointment.end_time = end_time;
      if (doctor_id) appointment.doctor_id = doctor_id;
    }

    if (patient_id) appointment.patient_id = patient_id;

    await appointment.save();

    res.status(200).json({ message: "Appointment updated successfully", data: appointment });
  } catch (error) {
    console.error("Error updating appointment:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getDoctorAppointments = async (req, res) => {
  try {
    const doctorId = req.user.user_id;

    if (!doctorId) {
      return res.status(400).json({ message: "Doctor ID missing in token" });
    }

    const appointments = await Appointment.findAll({
      where: { doctor_id: doctorId },
      include: [
        {
          model: Patient,
          attributes: ["patient_id", "name"],
        },
        {
          model: User,
          as: "Doctor",
          attributes: ["user_id", "name"],
        },
      ],
      order: [["appointment_date", "ASC"], ["start_time", "ASC"]],
    });

    const formatted = appointments.map((apt) => ({
      id: apt.appointment_id,
      appointment_date: apt.appointment_date,
      start_time: apt.start_time,
      end_time: apt.end_time,
      status: apt.status,
      patient_id: apt.patient_id,
      patient_name: apt.Patient?.name || "Unknown",
      doctor_id: apt.doctor_id,
      doctor_name: apt.Doctor?.name || "Unknown",
    }));

    res.status(200).json({
      message: "Doctor appointments fetched successfully",
      appointments: formatted,
    });
  } catch (error) {
    console.error("Error fetching doctor's appointments:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
