import express from "express";
import { authenticateUser } from "../middlewares/authMiddleware.js";
import { getPermissions } from "../controllers/permissionController.js";

const router = express.Router();

router.get("/permissions", authenticateUser, getPermissions);

const permissionRoutes = router;
export default permissionRoutes;
