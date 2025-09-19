import db from "../models/index.js";

export const authorizePermission = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      const user = req.user;
      const hospitalId = req.query.hospitalId;

      if (!hospitalId) {
        const ownerCheck = await db.UserHospital.findOne({
          where: { user_id: user.user_id },
          include: [{ model: db.Role, as: "role" }],
        });

        if (ownerCheck && ownerCheck.role?.name === "Owner") {
          if (requiredPermission.toLowerCase() === "add_hospital") {
            return next();
          } else {
            return res.status(400).json({
              message: "Hospital ID required for this action",
            });
          }
        }

        return res.status(400).json({ message: "Hospital ID required in header" });
      }

      const userHospital = await db.UserHospital.findOne({
        where: { user_id: user.user_id, hospital_id: hospitalId },
        include: [
          {
            model: db.Role,
            as: "role",
            include: [
              {
                model: db.Permission,
                as: "permissions",
                through: { attributes: [] },
              },
            ],
          },
        ],
      });

      if (!userHospital) {
        return res.status(403).json({ message: "No role assigned in this hospital" });
      }

      // Owner bypass (once hospital exists)
      // if (userHospital.role.name === "Owner") {
      //   return next();
      // }

      const hasPermission = userHospital.role.permissions.some(
        (perm) => perm.name.toLowerCase() === requiredPermission.toLowerCase()
      );

      if (!hasPermission) {
        return res.status(403).json({ message: "Forbidden: missing permission" });
      }

      next();
    } catch (error) {
      res.status(500).json({ message: "Auth check failed", error: error.message });
    }
  };
};
