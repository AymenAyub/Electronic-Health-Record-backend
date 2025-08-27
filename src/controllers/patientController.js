import db from "../models/index.js";
import { Op } from "sequelize";

export const addPatient = async (req, res) => {
  try {
    const user = req.user; 
    const { hospital_id, name, age, gender, contact, CNIC, guardian_info, address, emergency_contact } = req.body;

    if (!user) return res.status(401).json({ message: "Unauthorized" });
    if (!hospital_id) return res.status(400).json({ message: "hospital_id is required" });
    if (!name || !contact) return res.status(400).json({ message: "Name and contact are required" });


    const userRecord = await db.UserHospital.findOne({
      where: { user_id: user.user_id, hospital_id, role: "staff" },
    });

    if (!userRecord) {
      return res.status(403).json({ message: "You are not authorized to add patients to this hospital." });
    }

    const newPatient = await db.Patient.create({
      hospital_id,
      name,
      age,
      gender,
      contact,
      CNIC,
      guardian_info,
      address,
      emergency_contact,
    });

    res.status(201).json({ patient: newPatient });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


export const getPatients = async (req, res) => {
  try {
    const user = req.user;
    const hospital_id = req.query.hospital_id;

    if (!user) return res.status(401).json({ message: "Unauthorized" });
    if (!hospital_id) return res.status(400).json({ message: "hospital_id is required" });

    const userRecord = await db.UserHospital.findOne({
        where: {
          user_id: user.user_id,
          hospital_id,
          role: { [Op.in]: ["admin", "staff"] },
        },
      });
    if (!userRecord) {
      return res.status(403).json({ message: "You are not authorized to view patients of this hospital." });
    }

    const patients = await db.Patient.findAll({
      where: { hospital_id },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({ patients });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updatePatient = async (req, res) => {
  try {
    const user = req.user;
    const { hospital_id } = req.body;
    const { patient_id } = req.params;

    if (!user) return res.status(401).json({ message: "Unauthorized" });
    if (!hospital_id || !patient_id)
      return res.status(400).json({ message: "hospital_id and patient_id are required" });

    const staffRecord = await db.UserHospital.findOne({
      where: { user_id: user.user_id, hospital_id, role: "staff" },
    });

    if (!staffRecord)
      return res.status(403).json({ message: "You are not authorized to update patients in this hospital." });

    const patient = await db.Patient.findOne({ where: { patient_id, hospital_id } });
    if (!patient) return res.status(404).json({ message: "Patient not found in this hospital" });

    await patient.update(req.body);

    res.json({ patient });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const deletePatient = async (req, res) => {
  try {
    const user = req.user;
    const hospital_id = req.query.hospital_id;
    const { patient_id } = req.params;

    if (!user) return res.status(401).json({ message: "Unauthorized" });
    if (!hospital_id || !patient_id)
      return res.status(400).json({ message: "hospital_id and patient_id are required" });

    const staffRecord = await db.UserHospital.findOne({
      where: { user_id: user.user_id, hospital_id, role: "staff" },
    });

    if (!staffRecord)
      return res.status(403).json({ message: "You are not authorized to delete patients in this hospital." });

    const patient = await db.Patient.findOne({ where: { patient_id, hospital_id } });
    if (!patient) return res.status(404).json({ message: "Patient not found in this hospital" });

    await patient.destroy();

    res.json({ message: "Patient deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
