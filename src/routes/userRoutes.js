import {addDoctor, addStaff, adminSignup, deleteUser, getDoctors, getStaff, login, updateUser } from "../controllers/usersController.js";
import express from "express";
import { authenticateUser } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/adminMiddleware.js";
import { checkHospitalMiddleware } from "../middlewares/checkHospitalMiddleware.js";

const router = express.Router();

router.post("/admin/signup", adminSignup);
router.post("/login",login);
router.post("/admin/addDoctor",authenticateUser, isAdmin, addDoctor);
router.get("/admin/getDoctors",authenticateUser,getDoctors);
router.post("/admin/addStaff",authenticateUser, isAdmin,addStaff);
router.get("/admin/getStaff",authenticateUser, getStaff);
router.put("/admin/updateUser/:id",authenticateUser,isAdmin, updateUser);
router.delete("/admin/deleteUser/:id", authenticateUser, isAdmin,deleteUser);
const userRoutes=router;
export default userRoutes;
