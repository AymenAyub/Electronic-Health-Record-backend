import {addDoctor, addStaff, adminSignup, deleteUser, getDoctors, getStaff, login, updateUser } from "../controllers/usersController.js";
import express from "express";
import { authenticateUser } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/adminMiddleware.js";
import { checkHospitalMiddleware } from "../middlewares/checkHospitalMiddleware.js";

const router = express.Router();

router.post("/admin/signup", adminSignup);
router.post("/login",login);
router.post("/admin/addDoctor",authenticateUser, isAdmin, checkHospitalMiddleware, addDoctor);
router.get("/admin/getDoctors",authenticateUser, isAdmin,getDoctors);
router.post("/admin/addStaff",authenticateUser, isAdmin, checkHospitalMiddleware,addStaff);
router.get("/admin/getStaff",authenticateUser, isAdmin, getStaff);
router.put("/admin/updateUser/:id",authenticateUser,isAdmin,checkHospitalMiddleware, updateUser);
router.delete("/admin/deleteUser/:id", authenticateUser, isAdmin, checkHospitalMiddleware,deleteUser);
const userRoutes=router;
export default userRoutes;
