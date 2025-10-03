import { checkHospital, registerHospital } from "../controllers/hospitalController.js";
import express from "express";
const router=express.Router();
import { authorizePermission } from "../middlewares/rbac.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";
import { isOwner } from "../middlewares/ownerMiddleware.js";

import { getMyHospital } from "../controllers/hospitalController.js";

// router.get("/check-subdomain/:value", checkSubdomain);
// router.get("/getBySubdomain/:subdomain", getBySubdomain);
router.get("/:hospital_id", authenticateUser, getMyHospital);
router.post("/registerHospital",authenticateUser, authorizePermission('add_hospital'),registerHospital);
router.get("/check",authenticateUser, isOwner, checkHospital)

const hospitalRoutes=router;
export default hospitalRoutes;