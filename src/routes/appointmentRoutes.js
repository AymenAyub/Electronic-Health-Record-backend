import express from "express";
import { scheduleAppointment } from "../controllers/appointmentController.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/scheduleAppointment", authenticateUser, scheduleAppointment);
const appointmentRoutes = router;
export default appointmentRoutes;
