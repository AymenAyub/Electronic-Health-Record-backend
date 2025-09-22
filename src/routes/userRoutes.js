import {addStaff, addUser, deleteUser, getAllUsers, getDoctors, getStaff, login, ownerSignup, updateUser } from "../controllers/usersController.js";
import express from "express";
import { authenticateUser } from "../middlewares/authMiddleware.js";
import { authorizePermission } from "../middlewares/rbac.js";

const router = express.Router();

router.post("/signup", ownerSignup);
router.post("/login",login);
router.get("/users", authenticateUser,authorizePermission('view_users'), getAllUsers);
router.post("/addUser",authenticateUser, authorizePermission('add_user'), addUser);
router.put("/updateUser/:id",authenticateUser, authorizePermission('edit_user'), updateUser);
router.delete("/deleteUser/:id", authenticateUser, authorizePermission('delete_user'), deleteUser)
router.post("/admin/addStaff",authenticateUser,addStaff);
router.get("/getDoctors",authenticateUser, getDoctors);

const userRoutes=router;
export default userRoutes;
