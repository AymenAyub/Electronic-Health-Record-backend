import express from "express";
import { getAppointments, getAppointmentsOfWeek, getDoctorAppointments, scheduleAppointment, updateAppointment } from "../controllers/appointmentController.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";
import { authorizePermission } from "../middlewares/rbac.js";

const router = express.Router();

router.post("/scheduleAppointment", authenticateUser, authorizePermission('add_appointment'), scheduleAppointment);
router.get("/appointments", authenticateUser, authorizePermission('view_appointments'), getAppointments);
router.put("/updateAppointment/:appointmentId", authenticateUser, authorizePermission('edit_appointment'),updateAppointment);
router.get("/getDoctorAppointments", authenticateUser, getDoctorAppointments );
router.get("/getWeekAppointments", authenticateUser, getAppointmentsOfWeek) ;

const appointmentRoutes = router;
export default appointmentRoutes;

