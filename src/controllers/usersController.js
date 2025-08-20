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
  
  export const addDoctor = async (req, res) => {
    try {
      const adminId = req.user.user_id; 

      console.log("Incoming request body:", req.body);
      console.log("User from middleware:", req.user);

      if (!adminId) {
        console.log("No user in request or invalid token");
        return res.status(401).json({ message: "Unauthorized, invalid token." });
      }
      const admin = await db.User.findByPk(adminId);

      
  
      if (!admin || admin.role !== "admin") {
      console.log("Admin not found or role invalid:", admin);
      return res.status(403).json({ message: "Unauthorized." });
    }

  
      const { name, email, password, specialty, contact, bio } = req.body;
  
      if (!name || !email || !password) {
        return res.status(400).json({ message: "Name, email, and password are required." });
      }
  
      const existingUser = await db.User.findOne({ where: { email } });
      if (existingUser) return res.status(400).json({ message: "Email already registered." });
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const doctor = await db.User.create({
        name,
        email,
        password: hashedPassword,
        role: "doctor",
        hospital_id: admin.hospital_id, 
        specialty,
        contact,
        bio,
      });
  
      res.status(201).json({ message: "Doctor added successfully.", doctor });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error." });
    }
  };
  

  export const getDoctors = async (req, res) => {
    try {
      const adminId = req.user?.user_id;
      if (!adminId) 
        return res.status(401).json({ message: "Unauthorized" });
  
      const doctors = await db.User.findAll({
        where: { hospital_id: req.user.hospital_id, role: "doctor" },
      });
  
      res.json({ doctors });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  };
  