import db from "../models/index.js";
import { Op } from "sequelize";

// export const getDashboardStats = async (req, res) => {
//   try {
//     const adminUser = req.user;

//     if (!adminUser?.hospital_id) {
//       return res.status(400).json({ error: "User is not linked to any hospital" });
//     }

//     const hospital = await db.Hospital.findByPk(adminUser.hospital_id);

//     if (!hospital) {
//       return res.status(404).json({ error: "Hospital not found" });
//     }

//     const hospitalId = hospital.id;

//     const activeDoctors = await db.User.count({
//       where: { hospital_id: hospitalId, role: "doctor" },
//     });

//     const registeredStaff = await db.User.count({
//       where: { hospital_id: hospitalId, role: "staff" },
//     });

//     const totalPatients = await db.Patient.count({
//       where: { hospital_id: hospitalId },
//     });

//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     const tomorrow = new Date(today);
//     tomorrow.setDate(today.getDate() + 1);

    // const appointmentsToday = await db.Appointment.count({
    //   where: {
    //     appointment_time: {
    //       [Op.between]: [startOfDay, endOfDay],
    //     },
    //   },
    //   include: [
    //     {
    //       model: db.Patient,
    //       where: { hospital_id: hospitalId },
    //     },
    //   ],
    // });
    

    // const revenueCollected = await db.Payment.sum("amount", {
    //   include: [
    //     {
    //       model: db.Patient,
    //       where: { hospital_id: hospitalId }
    //     }
    //   ],
    //   where: {
    //     status: "Paid" 
    //   }
    // });
    
//     return res.json({
//       activeDoctors,
//       registeredStaff,
//       totalPatients,
//       appointmentsToday:0 ,
//       revenueCollected:0,
//     });
//   } catch (err) {
//     console.error("getDashboardStats error:", err);
//     return res.status(500).json({ error: "Server error" });
//   }
// };


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

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const appointmentsToday = await db.Appointment.count({
      where: {
        hospital_id,
        appointment_time: { [Op.between]: [today, tomorrow] },
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

