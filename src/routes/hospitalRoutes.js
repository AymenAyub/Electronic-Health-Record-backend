import { checkHospital, registerHospital } from "../controllers/hospitalController.js";
import express from "express";
const router=express.Router();
import { authenticateUser } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/adminMiddleware.js";
import { checkSubdomain } from "../controllers/hospitalController.js";
import { getBySubdomain } from "../controllers/hospitalController.js";
import { getMyHospital } from "../controllers/hospitalController.js";

router.get("/check-subdomain/:value", checkSubdomain);
router.get("/getBySubdomain/:subdomain", getBySubdomain);
router.get("/me", authenticateUser, getMyHospital);
router.post("/registerHospital",authenticateUser, isAdmin , registerHospital);
router.get("/check",authenticateUser, isAdmin, checkHospital)

const hospitalRoutes=router;
export default hospitalRoutes;