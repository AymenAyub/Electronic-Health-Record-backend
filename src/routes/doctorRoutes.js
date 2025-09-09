
import express from "express";
import { getDoctorPatients } from "../controllers/doctorController.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";

const router = express.Router();


router.get("/getDoctorPatients", authenticateUser, getDoctorPatients);

 const doctorRoutes = router;
export default doctorRoutes;
