import db from "../models/index.js";

const { Role, Permission, RolePermission, UserHospital, User, Sequelize } = db;

export const createRole = async (req, res) => {
  try {
    const { name, description, permissions } = req.body;
    const hospital_id = req.query.hospitalId; 

    if (!hospital_id) {
  return res.status(400).json({ message: "Hospital ID is required in header" });
}


    if (!name || !permissions || permissions.length === 0) {
      return res.status(400).json({ message: "Role name and permissions are required" });
    }

    const role = await Role.create({
      hospital_id,
      name,
      description,
    });

    const rolePermissions = permissions.map((permId) => ({
      role_id: role.role_id,
      permission_id: permId,
    }));

    await RolePermission.bulkCreate(rolePermissions);

    const createdRole = await Role.findOne({
      where: { role_id: role.role_id },
      include: [
        {
          model: Permission,
          as: "permissions",
          through: { attributes: [] },
        },
      ],
    });

    return res.status(201).json(createdRole);
  } catch (error) {
    console.error("Error creating role:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};


export const getRoles = async (req, res) => {
  try {
    const hospital_id = req.query.hospitalId;
    if (!hospital_id) {
      return res.status(400).json({ message: "Hospital ID is required" });
    }

    let roles = await Role.findAll({
      where: {
          hospital_id 
      },
      include: [
        {
          model: Permission,
          as: "permissions",
          through: { attributes: [] },
        },
        {
          model: UserHospital,
          as: "userHospitals",
          include: [
            {
              model: User,
              as: "user",
              attributes: ["user_id", "name", "email"],
            },
          ],
        },
      ],
      order: [["role_id", "ASC"]],
    });

    roles = roles.map(role => {
      const r = role.toJSON();
      r.users = r.userHospitals.map(uh => uh.user);
      delete r.userHospitals;
      return r;
    });

    return res.status(200).json(roles);
  } catch (error) {
    console.error("Error fetching roles:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

export const updateRole = async (req, res) => {
  try {
    const { roleId } = req.params;
    const hospital_id = req.query.hospitalId;
    const { name, description, permissions } = req.body;

    if (!hospital_id) {
      return res.status(400).json({ message: "Hospital ID is required" });
    }

    const role = await Role.findOne({
      where: { role_id: roleId, hospital_id },
    });

    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    role.name = name;
    role.description = description;
    await role.save();

    await RolePermission.destroy({ where: { role_id: roleId } });

    if (permissions?.length) {
      const rolePerms = permissions.map((pid) => ({
        role_id: roleId,
        permission_id: pid,
        hospital_id,
      }));
      await RolePermission.bulkCreate(rolePerms);
    }

    const updatedRole = await Role.findOne({
      where: { role_id: roleId, hospital_id },
      include: [{ model: Permission, as: "permissions" }],
    });

    res.json({ message: "Role updated successfully", role: updatedRole });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating role" });
  }
};
