// import db from "../models/index.js";
// import { Op } from "sequelize";

// const MedicalHistory = db.MedicalHistory;
// const Patient = db.Patient;

// export const createHistory = async (req, res) => {
//   try {
//     const user = req.user;
//     const { hospital_id, patient_id, diagnosis, past_illnesses, prescriptions } = req.body;

//     const patient = await Patient.findOne({ where: { patient_id, hospital_id } });
//     if (!patient) return res.status(404).json({ message: "Patient not found in this hospital" });

//     const history = await MedicalHistory.create({
//       patient_id,
//       hospital_id,
//       diagnosis,
//       past_illnesses,
//       prescriptions,
//       createdBy: user.user_id,
//     });

//     res.status(201).json({
//       message: "Medical history created successfully",
//       data: history,
//     });
//   } catch (error) {
//     console.error("Error creating history:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// export const getPatientHistory = async (req, res) => {
//   try {
    
//      const hospital_id = req.query.hospital_id;
//      const { patientId } = req.params;

//     const patient = await Patient.findOne({ where: { patient_id: patientId, hospital_id: hospital_id } });
//     if (!patient) return res.status(404).json({ message: "Patient not found in this hospital" });

//     const history = await MedicalHistory.findAll({
//       where: { patient_id: patientId, hospital_id: hospital_id },
//       order: [["createdAt", "DESC"]],
//     });

//     res.status(200).json({
//       message: "Medical history fetched successfully",
//       history,
//     });
//   } catch (error) {
//     console.error("Error fetching history:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// export const updateHistory = async (req, res) => {
//   try {
//     const user = req.user;
//     const { historyId } = req.params;
//     const { hospital_id, diagnosis, past_illnesses, prescriptions } = req.body;

//     if (!user) return res.status(401).json({ message: "Unauthorized" });
//     if (!hospital_id) return res.status(400).json({ message: "hospital_id is required" });

//     const userRecord = await db.UserHospital.findOne({
//       where: {
//         user_id: user.user_id,
//         hospital_id,
//         role: { [Op.in]: ["admin", "staff", "doctor"] },
//       },
//     });

//     if (!userRecord) {
//       return res.status(403).json({ message: "You are not authorized to update histories in this hospital." });
//     }

//     const history = await db.MedicalHistory.findOne({
//       where: { history_id: historyId, hospital_id },
//     });

//     if (!history) return res.status(404).json({ message: "Medical history not found in this hospital" });

//     await history.update({
//       diagnosis: diagnosis ?? history.diagnosis,
//       past_illnesses: past_illnesses ?? history.past_illnesses,
//       prescriptions: prescriptions ?? history.prescriptions,
//     });

//     res.status(200).json({
//       message: "Medical history updated successfully",
//       history,
//     });
//   } catch (error) {
//     console.error("Error updating history:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };


// export const deleteHistory = async (req, res) => {
//   try {
//      const user = req.user;
//     const { historyId } = req.params;
//     const hospital_id = req.query.hospital_id;
    
//     if (!user) return res.status(401).json({ message: "Unauthorized" });
//     if (!hospital_id) return res.status(400).json({ message: "hospital_id is required" });

//     const userRecord = await db.UserHospital.findOne({
//       where: {
//         user_id: user.user_id,
//         hospital_id,
//         role: { [Op.in]: ["admin", "staff", "doctor"] },
//       },
//     });

//     if (!userRecord) {
//       return res.status(403).json({ message: "You are not authorized to update histories in this hospital." });
//     }

//     const history = await MedicalHistory.findByPk(historyId);
//     if (!history) return res.status(404).json({ message: "Medical history not found" });

//     await history.destroy();

//     res.status(200).json({ message: "Medical history deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting history:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };
