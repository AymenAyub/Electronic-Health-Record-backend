import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../models/index.js";

export const adminSignup = async (req, res) => {
  try {
    const { name, email, password, contact} = req.body;

    const existingUser = await db.User.findOne({ where: { email } });
    if (existingUser)
      return res.status(409).json({ message: "User already exists" });

      const hashedPassword = await bcrypt.hash(password, 10);

      const adminUser = await db.User.create({
      name,
      email,
      password: hashedPassword,
      contact,
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

    const user = await db.User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ message: "Incorrect password" });

    const userHospitals = await db.UserHospital.findAll({
      where: { user_id: user.user_id },
      attributes: ["hospital_id", "role"],
      include: [
        {
          model: db.Hospital,
          as : 'hospital',
          attributes: ["id", "name", "subdomain", "email", "phone", "address"],
        },
      ],
      raw: false,
    });
    
    const hospitals = userHospitals.map((uh) => ({
      hospital_id: uh.hospital_id,
      role: uh.role,
      hospital: uh.hospital ? uh.hospital.dataValues : null,
    }));

    const token = jwt.sign(
      { user_id: user.user_id, role: user.role, designation: user.designation, hospitals },
      process.env.JWT_SECRET
    );

    const { password: _, ...userWithoutPassword } = user.dataValues;

    res.status(200).json({
      message: "Login successful",
      token,
      user: userWithoutPassword,
      hospitals,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


export const addDoctor = async (req, res) => {
  try {
    const adminUser = req.user;
    const { name, email, password, specialty, contact, bio, hospital_id } = req.body;

    if (!name || !email || !password || !hospital_id) {
      return res.status(400).json({ message: "Missing Information." });
    }

    const adminHospitalRecord = await db.UserHospital.findOne({
      where: { user_id: adminUser.user_id, hospital_id, role: "admin" }
    });

    if (!adminHospitalRecord) {
      return res.status(403).json({ message: "You are not authorized to manage this hospital." });
    }

    const existingUser = await db.User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const doctor = await db.User.create({
      name,
      email,
      password: hashedPassword,
      role: "doctor",
      specialty,
      contact,
      bio,
    });

    await db.UserHospital.create({
      user_id: doctor.user_id,
      hospital_id,
      role: "doctor"
    });

    res.status(201).json({ message: "Doctor added successfully.", doctor });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
};


export const getDoctors = async (req, res) => {
  try {
    const adminUser = req.user;
    const hospital_id = req.query.hospital_id;

    if (!adminUser) return res.status(401).json({ message: "Unauthorized" });
    if (!hospital_id) return res.status(400).json({ message: "hospital_id is required" });

    const adminHospitalRecord = await db.UserHospital.findOne({
      where: { user_id: adminUser.user_id, hospital_id},
    });

    if (!adminHospitalRecord) {
      return res.status(403).json({ message: "You are not authorized to access this hospital." });
    }

    const userHospitalRecords = await db.UserHospital.findAll({
      where: { hospital_id, role: "doctor" },
      include: {
        model: db.User,
        as : 'user',
        attributes: { exclude: ["password"] },
      },
    });

    const doctors = userHospitalRecords.map(uh => uh.user);
    res.json({ doctors });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

  export const addStaff = async (req, res) => {
    try {
      const adminUser = req.user; 
      const { hospital_id, name, email, password, contact, designation } = req.body;
  
      if (!adminUser) return res.status(401).json({ message: "Unauthorized" });
      if (!hospital_id) return res.status(400).json({ message: "hospital_id is required" });
  
      const adminHospitalRecord = await db.UserHospital.findOne({
        where: { user_id: adminUser.user_id, hospital_id, role: "admin" },
      });
  
      if (!adminHospitalRecord) {
        return res.status(403).json({ message: "You are not authorized to manage this hospital." });
      }
  
      if (!name || !email || !password) {
        return res.status(400).json({ message: "Name, email, and password are required." });
      }
  
      const existingUser = await db.User.findOne({ where: { email } });
      if (existingUser) return res.status(400).json({ message: "Email already registered." });
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const staffUser = await db.User.create({
        name,
        email,
        password: hashedPassword,
        role: "staff",
        contact,
        designation,
      });
  
      await db.UserHospital.create({
        user_id: staffUser.user_id,
        hospital_id,
        role: "staff",
      });
  
      const { password: _, ...staffWithoutPassword } = staffUser.dataValues;

      res.status(201).json({ message: "Staff added successfully.", staff: staffWithoutPassword });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error." });
    }
  };

  export const getStaff = async (req, res) => {
    try {
      const adminUser = req.user;
      const hospital_id = req.query.hospital_id;

      if (!adminUser) return res.status(401).json({ message: "Unauthorized" });
      if (!hospital_id) return res.status(400).json({ message: "hospital_id is required" });
  
      const adminHospitalRecord = await db.UserHospital.findOne({
        where: { user_id: adminUser.user_id, hospital_id, role: "admin" },
      });
  
      if (!adminHospitalRecord) {
        return res.status(403).json({ message: "You are not authorized to access this hospital." });
      }
  
      const userHospitalRecords = await db.UserHospital.findAll({
        where: { hospital_id, role: "staff" },
        include: {
          model: db.User,
          as : 'user',
          attributes: { exclude: ["password"] },
        },
      });
  
      const staff = userHospitalRecords.map(uh => uh.user);
      res.json({ staff });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  };


export const updateUser = async (req, res) => {
  try {
    const adminUser = req.user;
    const { hospital_id } = req.body; 

    if (!adminUser) return res.status(401).json({ message: "Unauthorized" });
    if (!hospital_id) return res.status(400).json({ message: "hospital_id is required" });

    const adminHospitalRecord = await db.UserHospital.findOne({
      where: { user_id: adminUser.user_id, hospital_id, role: "admin" },
    });

    if (!adminHospitalRecord) {
      return res.status(403).json({ message: "You are not authorized to update users in this hospital." });
    }

    const { id } = req.params;
    const { name, email, password, specialty, contact, bio, designation } = req.body;

    const targetRecord = await db.UserHospital.findOne({
      where: { user_id: id, hospital_id, role: ["doctor", "staff"] },
      include: { model: db.User,
       as : 'user'
       },
    });

    if (!targetRecord) {
      return res.status(404).json({ message: "User not found in this hospital" });
    }

    const user = targetRecord.user;

    if (email && email !== user.email) {
      const existing = await db.User.findOne({ where: { email } });
      if (existing) return res.status(400).json({ message: "Email already in use" });
    }

    let updatedPassword = user.password;
    if (password) updatedPassword = await bcrypt.hash(password, 10);

    await user.update({
      name: name || user.name,
      email: email || user.email,
      password: updatedPassword,
      contact: contact || user.contact,
      specialty: user.role === "doctor" ? specialty || user.specialty : null,
      bio: user.role === "doctor" ? bio || user.bio : null,
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
    const adminUser = req.user;
    const hospital_id = req.query.hospital_id;

    if (!adminUser) return res.status(401).json({ message: "Unauthorized" });
    if (!hospital_id) return res.status(400).json({ message: "hospital_id is required" });

    const adminHospitalRecord = await db.UserHospital.findOne({
      where: { user_id: adminUser.user_id, hospital_id, role: "admin" },
    });

    if (!adminHospitalRecord) {
      return res.status(403).json({ message: "You are not authorized to delete users in this hospital." });
    }

    const { id } = req.params;

    const targetRecord = await db.UserHospital.findOne({
      where: { user_id: id, hospital_id, role: ["doctor", "staff"] },
      include: { model: db.User,
        as: 'user'
       },
    });

    if (!targetRecord) {
      return res.status(404).json({ message: "User not found in this hospital" });
    }

    const user = targetRecord.user;

    await user.destroy();

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Delete user error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
