import express from "express";
import { createRole, getRoles, updateRole } from "../controllers/roleController.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";
import { authorizePermission } from "../middlewares/rbac.js";

const router = express.Router();

router.post("/addRole", authenticateUser ,  createRole);
router.get("/roles", authenticateUser , getRoles);
router.put("/updateRole/:roleId", authenticateUser , updateRole);

const roleRoutes = router;
export default roleRoutes;
