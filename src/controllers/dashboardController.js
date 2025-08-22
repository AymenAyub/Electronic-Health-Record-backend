import db from "../models/index.js";

export const getDashboardStats = async (req, res) => {
  try {
    const adminUser = req.user;

    if (!adminUser?.hospital_id) {
      return res.status(400).json({ error: "User is not linked to any hospital" });
    }

    const hospital = await db.Hospital.findByPk(adminUser.hospital_id);

    if (!hospital) {
      return res.status(404).json({ error: "Hospital not found" });
    }

    const hospitalId = hospital.id;

    const activeDoctors = await db.User.count({
      where: { hospital_id: hospitalId, role: "doctor" },
    });

    const registeredStaff = await db.User.count({
      where: { hospital_id: hospitalId, role: "staff" },
    });

    const totalPatients = await db.Patient.count({
      where: { hospital_id: hospitalId },
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

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
    
    return res.json({
      activeDoctors,
      registeredStaff,
      totalPatients,
      appointmentsToday:0 ,
      revenueCollected:0,
    });
  } catch (err) {
    console.error("getDashboardStats error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
