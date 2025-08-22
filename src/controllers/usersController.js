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
        process.env.JWT_SECRET
        // { expiresIn: "1h" }
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
        attributes: { exclude: ["password"] }

      });
  
      res.json({ doctors });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  };
  

  export const addStaff = async (req, res) => {
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

  
      const { name, email, password, contact, designation } = req.body;
  
      if (!name || !email || !password) {
        return res.status(400).json({ message: "Name, email, and password are required." });
      }
  
      const existingUser = await db.User.findOne({ where: { email } });
      if (existingUser) return res.status(400).json({ message: "Email already registered." });
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const staff = await db.User.create({
        name,
        email,
        password: hashedPassword,
        role: "staff",
        hospital_id: admin.hospital_id, 
        contact,
        designation,
      });
  
      res.status(201).json({ message: "Staff added successfully.", staff });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error." });
    }
  };
  

  export const getStaff = async (req, res) => {
    try {
      const adminId = req.user?.user_id;

      if (!adminId) 
        return res.status(401).json({ message: "Unauthorized" });

      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Unauthorized" });
      }
  
      const staff = await db.User.findAll({
        where: { hospital_id: req.user.hospital_id, role: "staff" },
        attributes: { exclude: ["password"] },
      });
  
      res.json({ staff });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  };

  // Update Doctor or Staff
export const updateUser = async (req, res) => {
  try {
    const adminId = req.user?.user_id;

    if (!adminId) 
      return res.status(401).json({ message: "Unauthorized" });

    const admin = await db.User.findByPk(adminId);

    if (!admin || admin.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const { id } = req.params; 
    const { name, email, password, specialty, contact, bio, designation } = req.body;

    const user = await db.User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

  
    if (user.role !== "doctor" && user.role !== "staff") {
      return res.status(400).json({ message: "Only doctor or staff can be updated" });
    }


    if (email && email !== user.email) {
      const existing = await db.User.findOne({ where: { email } });
      if (existing) return res.status(400).json({ message: "Email already in use" });
    }

    let updatedPassword = user.password;
    if (password) {
      updatedPassword = await bcrypt.hash(password, 10);
    }


    await user.update({
      name: name || user.name,
      email: email || user.email,
      password: updatedPassword,
      contact: contact || user.contact,
      // doctor-specific
      specialty: user.role === "doctor" ? specialty || user.specialty : null,
      bio: user.role === "doctor" ? bio || user.bio : null,
      // staff-specific
      designation: user.role === "staff" ? designation || user.designation : null,
    });

    const { password: _, ...userWithoutPassword } = user.dataValues;

    res.json({ message: "User updated successfully", user: userWithoutPassword });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteUser = async (req, res) => {
  try {

    const adminId = req.user?.user_id;

    if (!adminId) 
      return res.status(401).json({ message: "Unauthorized" });

    const admin = await db.User.findByPk(adminId);

    if (!admin || admin.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }
    const { id } = req.params;

    const user = await db.User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.destroy();

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Delete user error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
