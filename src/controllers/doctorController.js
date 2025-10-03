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

export const addDoctor = async (req, res) => {
  try {
    const adminUser = req.user;
    const { name, email, password, specialty, contact, bio, hospital_id } = req.body;

    if (!name || !email || !password || !hospital_id) {
      return res.status(400).json({ message: "Missing Information." });
    }

    const adminHospitalRecord = await db.UserHospital.findOne({
      where: { user_id: adminUser.user_id, hospital_id, role: "admin" }
    });

    if (!adminHospitalRecord) {
      return res.status(403).json({ message: "You are not authorized to manage this hospital." });
    }

    const existingUser = await db.User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const doctor = await db.User.create({
      name,
      email,
      password: hashedPassword,
      role: "doctor",
      specialty,
      contact,
      bio,
    });

    await db.UserHospital.create({
      user_id: doctor.user_id,
      hospital_id,
      role: "doctor"
    });

    res.status(201).json({ message: "Doctor added successfully.", doctor });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
};


export const getDoctors = async (req, res) => {
  try {
    const user = req.user;
    const hospital_id = req.query.hospitalId;

    if (!user) return res.status(401).json({ message: "Unauthorized" });
    if (!hospital_id) return res.status(400).json({ message: "hospital_id is required" });

    const userHospitalRecord = await db.UserHospital.findOne({
      where: { user_id: user.user_id, hospital_id },
    });

    if (!userHospitalRecord) {
      return res.status(403).json({ message: "You are not authorized to access this hospital." });
    }

    const doctorRecords = await db.UserHospital.findAll({
      where: { hospital_id },
      include: [
        {
          model: db.Role,
          as: "role",
          where: { name: "Doctor" },
        },
        {
          model: db.User,
          as: "user",
          attributes: { exclude: ["password"] },
        },
      ],
    });

    const doctors = doctorRecords.map(record => record.user);
    res.json({ doctors });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
