import express from "express";
import { authenticateUser } from "../middlewares/authMiddleware.js";
import { getMe, getPermissions } from "../controllers/permissionController.js";

const router = express.Router();

router.get("/permissions", authenticateUser, getPermissions);
router.get("/permissions/me", authenticateUser, getMe);
const permissionRoutes = router;
export default permissionRoutes;
