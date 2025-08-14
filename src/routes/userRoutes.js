import { adminSignup, login } from "../controllers/usersController.js";
import express from "express";

const router = express.Router();

router.post("/admin/signup", adminSignup);
router.post("/login",login);

const userRoutes=router;
export default userRoutes;
