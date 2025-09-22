import db from "../models/index.js";
import { Op } from "sequelize";
import { parseISO, isValid } from "date-fns";


export const addAvailability = async (req, res) => {
  try {
    const doctorId = req.user.user_id;
    const hospital_id=req.query.hospitalId;
    const { day_of_week, start_time, end_time, slot_duration } = req.body;

    if (!hospital_id || day_of_week === undefined || !start_time || !end_time) {
      return res.status(400).json({
        message: "All fields are required.",
      });
    }

    const existing = await db.DoctorAvailability.findOne({
      where: { doctor_id: doctorId, day_of_week, hospital_id },
    });

    
    if (existing) {
      existing.start_time = start_time;
      existing.end_time = end_time;
      existing.slot_duration = slot_duration;
      existing.hospital_id = hospital_id; 
      await existing.save();

      return res.status(200).json({
        message: "Availability updated successfully",
        availability: existing,
      });
    }

    const newAvailability = await db.DoctorAvailability.create({
      doctor_id: doctorId,
      hospital_id,
      day_of_week,
      start_time,
      end_time,
      slot_duration: slot_duration || 30,
    });

    res.status(201).json({
      message: "Availability added successfully.",
      availability: newAvailability,
    });
  } catch (error) {
    console.error("Error adding availability:", error);
    res.status(500).json({ message: "Server error while adding availability." });
  }
};

export const getMyAvailability = async (req, res) => {
  try {
    const doctor = req.user;

    const availabilities = await db.DoctorAvailability.findAll({
      where: { doctor_id: doctor.user_id },
      include: [
        {
          model: db.Hospital,
          as: "hospital",
          attributes: ["id", "name", "address"],
        },
      ],
      order: [["day_of_week", "ASC"], ["start_time", "ASC"]],
    });

    res.status(200).json({
      message: "Availabilities fetched successfully.",
      availabilities,
    });
  } catch (error) {
    console.error("Error fetching availability:", error);
    res.status(500).json({ message: "Server error while fetching availability." });
  }
};

export const deleteAvailability = async (req, res) => {
  try {
    const doctorId = req.user.user_id; 
    const { availabilityId } = req.params;

    // if (req.user.role !== "doctor") {
    //   return res.status(403).json({ message: "Only doctors can delete availability" });
    // }

    const availability = await db.DoctorAvailability.findOne({
      where: { availability_id: availabilityId, doctor_id: doctorId },
    });

    if (!availability) {
      return res.status(404).json({ message: "Availability not found or not owned by this doctor" });
    }

    await availability.destroy();

    res.status(200).json({ message: "Availability deleted successfully" });
  } catch (error) {
    console.error("Error deleting availability:", error);
    res.status(500).json({ message: "Error deleting availability", error: error.message });
  }
};

export const getDoctorAvailableSlots = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { date } = req.query; 

    if (!date) {
      return res.status(400).json({ message: "Date is required in query param" });
    }

    const targetDate = parseISO(date);

    const dayOfWeek = targetDate.getDay(); 

    const availability = await db.DoctorAvailability.findOne({
      where: {
        doctor_id: doctorId,
        day_of_week: dayOfWeek,
      },
    });

    if (!availability) {
      return res.status(200).json({ slots: [], message: "Doctor not available on this day" });
    }

    const slotDuration = availability.slot_duration || 30; 
    const startTime = availability.start_time; 
    const endTime = availability.end_time;   

    const bookedAppointments = await db.Appointment.findAll({
      where: {
        doctor_id: doctorId,
        appointment_date: date,
        status: { [Op.ne]: "Cancelled" },
      },
      attributes: ["start_time"],
    });

    const bookedTimes = bookedAppointments.map(a => a.start_time); 

    let slots = [];
    const [startHours, startMinutes] = startTime.split(":").map(Number);
    const [endHours, endMinutes] = endTime.split(":").map(Number);

    let current = new Date(date);
    current.setHours(startHours, startMinutes, 0, 0);

    const endDateTime = new Date(date);
    endDateTime.setHours(endHours, endMinutes, 0, 0);

     const today = new Date().toISOString().split("T")[0];

    while (current < endDateTime) {
      const slot = current.toTimeString().slice(0, 8);
       if (date === today && current < new Date()) {
        current.setMinutes(current.getMinutes() + slotDuration);
        continue;
      }
      if (!bookedTimes.includes(slot)) {
        slots.push(slot);
      }
      current.setMinutes(current.getMinutes() + slotDuration);
    }

    res.status(200).json({
      message: "Available slots fetched successfully",
      slots,
    });

  } catch (error) {
    console.error("Error fetching slots:", error);
    res.status(500).json({ message: "Error fetching doctor slots", error: error.message });
  }
};
