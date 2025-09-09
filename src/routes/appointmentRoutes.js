import express from "express";
import { getAppointments, getDoctorAppointments, scheduleAppointment, updateAppointment } from "../controllers/appointmentController.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/scheduleAppointment", authenticateUser, scheduleAppointment);
router.get("/appointments", authenticateUser, getAppointments);
router.put("/updateAppointment/:appointmentId", authenticateUser, updateAppointment);
router.get("/getDoctorAppointments", authenticateUser, getDoctorAppointments );
const appointmentRoutes = router;
export default appointmentRoutes;

