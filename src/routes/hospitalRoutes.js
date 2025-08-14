import { registerHospital } from "../controllers/hospitalController.js";
import express from "express";
const router=express.Router();
import { authenticateUser } from "../middlewares/authMiddleware.js";

router.post("/registerHospital",authenticateUser, registerHospital);

const hospitalRoutes=router;
export default hospitalRoutes;