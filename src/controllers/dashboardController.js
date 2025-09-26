import db from "../models/index.js";
import { Op } from "sequelize";
import { startOfDay, addDays } from "date-fns";

export const getDashboardStats = async (req, res) => {
  try {
    const user = req.user;
    const hospital_id = req.query.hospitalId;

    if (!user) return res.status(401).json({ error: "Unauthorized" });
    if (!hospital_id) return res.status(400).json({ error: "hospital_id is required" });

    const userHospital = await db.UserHospital.findOne({
      where: { user_id: user.user_id, hospital_id },
      include: [
        { model: db.Role, as: "role" }
      ]
    });

    if (!userHospital) return res.status(403).json({ error: "Not authorized for this hospital" });

    const [activeDoctors, totalPatients, appointmentsToday, revenueCollected] =
      await Promise.all([
        db.UserHospital.count({ where: { hospital_id, role_id: await getRoleId("Doctor", hospital_id) } }),
        db.Patient.count({ where: { hospital_id } }),
        db.Appointment.count({
          where: {
            hospital_id,
            appointment_date: { [Op.between]: [startOfDay(new Date()), addDays(startOfDay(new Date()), 1)] }
          }
        }),
        db.Payment.sum("amount", { where: { hospital_id, status: "Paid" } })
      ]);

    return res.json({
      activeDoctors,
      totalPatients,
      appointmentsToday,
      revenueCollected: revenueCollected || 0
    });

  } catch (err) {
    console.error("getDashboardStats error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

async function getRoleId(roleName, hospital_id) {
  const role = await db.Role.findOne({ where: { name: roleName, hospital_id } });
  return role ? role.role_id : null;
}
