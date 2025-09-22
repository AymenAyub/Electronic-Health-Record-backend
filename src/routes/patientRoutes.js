import express from "express";
import { addPatient , getPatients, updatePatient, deletePatient } from "../controllers/patientController.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post("/patients/addPatient", authenticateUser, addPatient);
router.get("/getPatients", authenticateUser, getPatients);
router.put("/patients/updatePatient/:patient_id",authenticateUser, updatePatient);
router.delete("/patients/deletePatient/:patient_id", authenticateUser,deletePatient);


const patientRoutes=router;

export default patientRoutes;
