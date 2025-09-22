import express from "express";
import { createRole, getRoles, updateRole } from "../controllers/roleController.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";
import { authorizePermission } from "../middlewares/rbac.js";

const router = express.Router();

router.post("/addRole", authenticateUser , authorizePermission("add_role"), createRole);
router.get("/roles", authenticateUser , authorizePermission("view_roles"), getRoles);
router.put("/updateRole/:roleId", authenticateUser , authorizePermission("edit_role"), updateRole);

const roleRoutes = router;
export default roleRoutes;
