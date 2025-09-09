import express from "express";
import {
  createHistory,
  getPatientHistory,
  updateHistory,
  deleteHistory,
} from "../controllers/medicalHistoryController.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/createHistory", authenticateUser, createHistory);
router.get("/:patientId", authenticateUser, getPatientHistory);
router.put("/updateHistory/:historyId", authenticateUser, updateHistory);
router.delete("/:historyId", authenticateUser, deleteHistory);


const medicalHistoryRoutes=router;

export default medicalHistoryRoutes;
