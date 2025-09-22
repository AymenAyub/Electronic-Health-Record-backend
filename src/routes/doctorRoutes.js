
import express from "express";
import { getDoctorPatients, addDoctor, getDoctors } from "../controllers/doctorController.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";

const router = express.Router();


router.get("/getDoctorPatients", authenticateUser, getDoctorPatients);
router.post("/admin/addDoctor",authenticateUser, addDoctor);
router.get("/admin/getDoctors",authenticateUser,getDoctors);

 const doctorRoutes = router;
export default doctorRoutes;
