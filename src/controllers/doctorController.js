import db from "../models/index.js";

const Appointment = db.Appointment;
const Patient = db.Patient;

export const getDoctorPatients = async (req, res) => {
  try {
    const doctorId = req.user.user_id;

    const appointments = await Appointment.findAll({
      where: { doctor_id: doctorId },
      include: [
        {
          model: Patient,
          attributes: ["patient_id", "name", "age", "gender", "contact"],
        },
      ],
      order: [["appointment_date", "ASC"]],
    });

    const uniquePatientsMap = {};
    appointments.forEach((apt) => {
      if (apt.Patient && !uniquePatientsMap[apt.Patient.patient_id]) {
        uniquePatientsMap[apt.Patient.patient_id] = apt.Patient;
      }
    });

    const patients = Object.values(uniquePatientsMap);

    res.status(200).json({
      message: "Doctor patients fetched successfully",
      patients,
    });
  } catch (err) {
    console.error("Error fetching doctor patients:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
