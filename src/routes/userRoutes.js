import {addDoctor, adminSignup, getDoctors, login } from "../controllers/usersController.js";
import express from "express";
import { authenticateUser } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/adminMiddleware.js";

const router = express.Router();

router.post("/admin/signup", adminSignup);
router.post("/login",login);
router.post("/admin/addDoctor",authenticateUser, isAdmin, addDoctor);
router.get("/admin/getDoctors",authenticateUser, isAdmin, getDoctors);
const userRoutes=router;
export default userRoutes;
