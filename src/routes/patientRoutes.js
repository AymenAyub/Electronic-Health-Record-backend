import express from "express";
import { addPatient , getPatients, updatePatient, deletePatient } from "../controllers/patientController.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";
import { authorizePermission } from "../middlewares/rbac.js";
const router = express.Router();

router.post("/patients/addPatient", authenticateUser,authorizePermission('add_patient'), addPatient);
router.get("/getPatients", authenticateUser,authorizePermission('view_patients'), getPatients);
router.put("/patients/updatePatient/:patient_id",authenticateUser, authorizePermission('edit_patients'), updatePatient);
router.delete("/patients/deletePatient/:patient_id", authenticateUser,deletePatient);


const patientRoutes=router;

export default patientRoutes;
