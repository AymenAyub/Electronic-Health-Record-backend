import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../models/index.js";

export const adminSignup = async (req, res) => {
  try {
    const { name, email, password} = req.body;

    const existingUser = await db.User.findOne({ where: { email } });
    if (existingUser)
      return res.status(409).json({ message: "User already exists" });

      const hashedPassword = await bcrypt.hash(password, 10);

      const adminUser = await db.User.create({
      name,
      email,
      password: hashedPassword,
      role: "admin",
    });

    res.status(201).json({
      message: "Admin registered successfully",
      userId: adminUser.user_id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const login = async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await db.User.findOne({
        where:{ email }
      });
  
      if (!user) 
        return res.status(404).json({ message: "User not found" });
  
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) 
        return res.status(401).json({ message: "Incorrect password" });
  
      const token = jwt.sign(
        { id: user.user_id, role: user.role, hospitalId: user.hospital_id },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
  
      const { password: _, ...userWithoutPassword } = user.dataValues;
      res.json({ token, user: userWithoutPassword });
          } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
