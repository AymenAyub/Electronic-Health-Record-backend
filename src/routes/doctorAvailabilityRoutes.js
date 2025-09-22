
import express from "express";
import { isDoctor } from "../middlewares/doctorMiddleware.js";
import { addAvailability, deleteAvailability, getDoctorAvailableSlots, getMyAvailability } from "../controllers/doctorAvailabilityController.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";
import { authorizePermission } from "../middlewares/rbac.js";

const router = express.Router();

router.post("/addAvailability", authenticateUser ,authorizePermission("add_availability"), addAvailability);
router.get("/getMyAvailability", authenticateUser,authorizePermission("view_availability"), getMyAvailability);
router.delete("/deleteAvailability/:availabilityId", authenticateUser, authorizePermission("delete_availability"),deleteAvailability);
router.get("/doctors/:doctorId/availability", authenticateUser,getDoctorAvailableSlots);

 const doctorAvailabilityRoutes = router
export default doctorAvailabilityRoutes;
