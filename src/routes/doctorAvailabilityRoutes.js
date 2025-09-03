
import express from "express";
import { isDoctor } from "../middlewares/doctorMiddleware.js";
import { addAvailability, deleteAvailability, getDoctorAvailableSlots, getMyAvailability, updateAvailability } from "../controllers/doctorAvailabilityController.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/addAvailability", authenticateUser , addAvailability);
router.get("/getMyAvailability", authenticateUser, getMyAvailability);
router.put("/updateAvailability/:availabilityId", authenticateUser, updateAvailability);
router.delete("/deleteAvailability/:availabilityId", authenticateUser, deleteAvailability);
router.get("/doctors/:doctorId/availability", authenticateUser, getDoctorAvailableSlots);

 const doctorAvailabilityRoutes = router
export default doctorAvailabilityRoutes;
