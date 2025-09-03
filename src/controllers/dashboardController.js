import db from "../models/index.js";
import { Op } from "sequelize";
import { startOfDay, addDays } from "date-fns";

export const getDashboardStats = async (req, res) => {
  try {
    const user = req.user;
    const hospital_id = req.params.hospital_id; 

    if (!user) return res.status(401).json({ error: "Unauthorized" });
    if (!hospital_id) return res.status(400).json({ error: "hospital_id is required" });

    const userRecord = await db.UserHospital.findOne({
      where: { user_id: user.user_id, hospital_id },
    });
    
    if (!userRecord) return res.status(403).json({ error: "Not authorized for this hospital" });

    const activeDoctors = await db.UserHospital.count({
      where: { hospital_id, role: "doctor" },
    });

    const registeredStaff = await db.UserHospital.count({
      where: { hospital_id, role: "staff" },
    });

    const totalPatients = await db.Patient.count({
      where: { hospital_id },
    });

   

    const today = startOfDay(new Date());
    const tomorrow = addDays(today, 1);
    
    
    const appointmentsToday = await db.Appointment.count({
          where: {
            hospital_id,
            appointment_date: { [Op.between]: [today, tomorrow] },
          },
        });


    const revenueCollected = await db.Payment.sum("amount", {
      where: {
        hospital_id,
        status: "Paid",
      },
    });

    return res.json({
      activeDoctors,
      registeredStaff,
      totalPatients,
      appointmentsToday,
      revenueCollected,
    });
  } catch (err) {
    console.error("getDashboardStats error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

