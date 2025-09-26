import express from "express";
import {
  createHistory,
  getPatientHistory,
  updateHistory,
  deleteHistory,
} from "../controllers/medicalHistoryController.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";
import { authorizePermission } from "../middlewares/rbac.js";
const router = express.Router();

router.post("/createHistory", authenticateUser, authorizePermission('add_medical_history'), createHistory);
router.get("/:patientId", authenticateUser, authorizePermission('view_medical_history'), getPatientHistory);
router.put("/updateHistory/:historyId", authenticateUser,authorizePermission('edit_medical_history'), updateHistory);
router.delete("/:historyId", authenticateUser,authorizePermission('delete_medical_history'), deleteHistory);


const medicalHistoryRoutes=router;

export default medicalHistoryRoutes;
