import {addDoctor, addStaff, addUser, deleteUser, getAllUsers, getDoctors, getStaff, login, ownerSignup, updateUser } from "../controllers/usersController.js";
import express from "express";
import { authenticateUser } from "../middlewares/authMiddleware.js";
import { authorizePermission } from "../middlewares/rbac.js";

const router = express.Router();

router.post("/signup", ownerSignup);
router.post("/login",login);
router.get("/users",authenticateUser,getAllUsers);
router.post("/addUser",authenticateUser, authorizePermission('add_user'), addUser);
router.post("/admin/addDoctor",authenticateUser, addDoctor);
router.get("/admin/getDoctors",authenticateUser,getDoctors);
router.post("/admin/addStaff",authenticateUser,addStaff);
router.get("/admin/getStaff",authenticateUser, getStaff);
router.put("/admin/updateUser/:id",authenticateUser, updateUser);
router.delete("/admin/deleteUser/:id", authenticateUser,deleteUser);
const userRoutes=router;
export default userRoutes;
