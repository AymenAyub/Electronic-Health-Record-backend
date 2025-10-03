import { addUser, changePassword, deleteUser, getAllUsers, getDoctors, getMe, login, ownerSignup, updateMe, updateUser } from "../controllers/usersController.js";
import express from "express";
import { authenticateUser } from "../middlewares/authMiddleware.js";
import { authorizePermission } from "../middlewares/rbac.js";

const router = express.Router();

router.post("/signup", ownerSignup);
router.post("/login",login);
router.get("/users", authenticateUser,authorizePermission('view_users'), getAllUsers);
router.post("/addUser",authenticateUser, authorizePermission('add_user'), addUser);
router.put("/updateUser/:id",authenticateUser, authorizePermission('edit_user'), updateUser);
router.delete("/deleteUser/:id", authenticateUser, authorizePermission('delete_user'), deleteUser);
router.get("/user/getMe", authenticateUser, getMe);
router.put("/user/updateMe",authenticateUser, updateMe);
router.put("/user/changePassword",authenticateUser, changePassword);
const userRoutes=router;
export default userRoutes;
