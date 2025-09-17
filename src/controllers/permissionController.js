import db from "../models/index.js";

const { Permission } = db;

export const getPermissions = async (req, res) => {
  try {
    const permissions = await Permission.findAll({
      attributes: ["permission_id", "name", "description"],
    });

    return res.status(200).json(permissions);
  } catch (error) {
    console.error("Error fetching permissions:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
