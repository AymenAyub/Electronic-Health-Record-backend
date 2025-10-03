import db from "../models/index.js";

const { UserHospital, User, Role, Permission } = db;

export const getPermissions = async (req, res) => {
  try {
    const hospital_id=req.query.hospitalId;
    console.log('hospital id ', hospital_id);
    
    const permissions = await Permission.findAll({
      attributes: ["permission_id", "name", "description"],
    });

    return res.status(200).json(permissions);
  } catch (error) {
    console.error("Error fetching permissions:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};


export const getMe = async (req, res) => {
  try {
    const userId = req.user.user_id; 
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userHospital = await UserHospital.findOne({
      where: { user_id: userId },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["user_id", "name", "email"]
        },
        {
          model: Role,
          as: "role",
          attributes: ["role_id", "name"],
          include: [
            {
              model: Permission,
              as: "permissions",
              attributes: ["permission_id", "name", "description"],
              through: { attributes: [] }
            }
          ]
        }
      ]
    });

    if (!userHospital) {
      return res.status(404).json({ message: "User not found in any hospital" });
    }

    const user = userHospital.user;
    const role = userHospital.role;
    const permissions = role.permissions;

    res.status(200).json({
      user_id: user.user_id,
      name: user.name,
      email: user.email,
      role: role.name,
      permissions: permissions.map(p => ({
        permission_id: p.permission_id,
        name: p.name,
        description: p.description
      }))
    });

  } catch (err) {
    console.error("Error in /permissions/me:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
