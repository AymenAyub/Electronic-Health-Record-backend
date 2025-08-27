import jwt from "jsonwebtoken";
import db from "../models/index.js";

export const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
    return res.status(401).json({ message: "No token" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const adminUser = await db.User.findOne({
      where: { user_id: decoded.user_id } 
    });
    
    if (!adminUser) 
        return res.status(404).json({ message: "User not found" });

    req.user = adminUser;
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized", error: error.message });
  }
};
