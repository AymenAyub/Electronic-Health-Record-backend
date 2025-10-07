import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../models/index.js";

export const ownerSignup = async (req, res) => {
  try {
    const { name, email, password, contact } = req.body;

    const existingUser = await db.User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await db.User.create({
      name,
      email,
      password: hashedPassword,
      contact,
    });

    const ownerRole = await db.Role.findOne({ where: { name: "Owner" } });
    if (!ownerRole) {
      return res.status(500).json({ message: "Owner role not found. Seed it first." });
    }

    await db.UserHospital.create({
      user_id: newUser.user_id,
      hospital_id: null,
      role_id: ownerRole.role_id,
    });

    res.status(201).json({
      message: "Owner registered successfully",
      userId: newUser.user_id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Signup failed", error: error.message });
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
      attributes: ["hospital_id"],
      include: [
        {
          model: db.Hospital,
          as: "hospital",
          attributes: ["id", "name", "email", "phone", "address"],
        },
        {
          model: db.Role,
          as: "role",
          attributes: ["role_id", "name"],
          include: [
            {
              model: db.Permission,
              as: "permissions",
              attributes: ["permission_id", "name", "description"],
              through: { attributes: [] },
            },
          ],
        },
      ],
    });

    const hospitals = userHospitals
      .filter((uh) => uh.hospital_id !== null)
      .map((uh) => ({
        hospital_id: uh.hospital_id,
        role: uh.role
          ? {
              id: uh.role.role_id,
              name: uh.role.name,
              permissions: uh.role.permissions.map((p) => ({
                id: p.permission_id,
                name: p.name,
                description: p.description,
              })),
            }
          : null,
        hospital: uh.hospital ? uh.hospital.dataValues : null,
      }));

    const defaultHospitalId = hospitals.length > 0 ? hospitals[0].hospital_id : null;

    const token = jwt.sign(
      { user_id: user.user_id, email: user.email, hospital_id: defaultHospitalId },
      process.env.JWT_SECRET
    );

    const { password: _, ...userWithoutPassword } = user.dataValues;

    res.json({
      message: "Login successful",
      token,
      user: userWithoutPassword,
      hospitals,
      defaultHospitalId,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


export const getAllUsers = async (req, res) => {
  try {
    const { hospitalId } = req.query;

    const users = await db.UserHospital.findAll({
      where: { hospital_id: hospitalId },
      include: [
        {
          model: db.User,
          as: "user",
          attributes: ["user_id", "name", "email" , "contact"],
        },
        {
          model: db.Role,
          as: "role",
          attributes: ["role_id", "name"],
        },
      ],
    });

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching users",
      error: err.message,
    });
  }
};

export const getDoctors = async (req, res) => {
  try {
    const user = req.user;
    const hospital_id = req.query.hospitalId;

    if (!user) return res.status(401).json({ message: "Unauthorized" });
    if (!hospital_id) return res.status(400).json({ message: "hospital_id is required" });

    const userHospitalRecord = await db.UserHospital.findOne({
      where: { user_id: user.user_id, hospital_id},
    });

    if (!userHospitalRecord) {
      return res.status(403).json({ message: "You are not authorized to access this hospital." });
    }

    const doctorRecords = await db.UserHospital.findAll({
      where: { hospital_id },
      include: [
        {
          model: db.Role,
          as: "role",
        },
        {
          model: db.User,
          as: "user",
          attributes: { exclude: ["password"] },
        },
      ],
    });

  const doctors = doctorRecords
        .filter(uh => uh.role?.name.toLowerCase() === "doctor")
        .map(uh => uh.user);

    res.json({ doctors });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const addUser = async (req, res) => {
  const t = await db.sequelize.transaction();
  try {
    const { hospitalId } = req.query;
    const { name, email, password, contact, roleId, specialty, bio, designation } = req.body;

    if (!hospitalId) {
      return res.status(400).json({ message: "Hospital ID is required" });
    }
    if (!name || !email || !password || !roleId) {
      return res.status(400).json({ message: "Name, email, password, and role are required" });
    }

    const role = await db.Role.findOne({ where: { role_id: roleId, hospital_id: hospitalId } });
    if (!role) {
      return res.status(400).json({ message: "Invalid role for this hospital" });
    }

    const existingUser = await db.User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ field: "email", message: "Email already registered" });
    }

    if (role.name === "Doctor" && !specialty) {
      return res.status(400).json({ field: "specialty", message: "Specialty is required for doctors" });
    }
    if (role.name === "Staff" && !designation) {
      return res.status(400).json({ field: "designation", message: "Designation is required for staff" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await db.User.create({
      name,
      email,
      password: hashedPassword,
      contact,
      specialty: specialty || null,
      bio: bio || null,
      designation: designation || null,
    }, { transaction: t });

    await db.UserHospital.create({
      user_id: user.user_id,
      hospital_id: hospitalId,
      role_id: roleId,
    }, { transaction: t });

    await t.commit();
    const { password: _, ...safeUser } = user.get({ plain: true });

    res.status(201).json({
      message: "User created successfully",
      user: safeUser,
    });

  } catch (err) {
    await t.rollback();
    console.error(err);
    res.status(500).json({
      message: "Error creating user",
      error: err.message,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const loginUser = req.user;
    const hospital_id  = req.query.hospitalId;
    const { id } = req.params; 

    if (!loginUser) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!hospital_id) {
      return res.status(400).json({ message: "hospital_id is required" });
    }

    const loginUserRecord = await db.UserHospital.findOne({
      where: { user_id: loginUser.user_id, hospital_id },
      include: [{ model: db.Role, as: "role", attributes: ["name"] }],
    });

    if (!loginUserRecord) {
      return res.status(403).json({
        message: "You are not authorized to update users in this hospital.",
      });
    }

    const targetRecord = await db.UserHospital.findOne({
      where: { user_id: id, hospital_id },
      include: [
        {
          model: db.User,
          as: "user",
        },
        {
          model: db.Role,
          as: "role",
          attributes: ["name"],
        },
      ],
    });

    if (!targetRecord) {
      return res
        .status(404)
        .json({ message: "User not found in this hospital" });
    }

    const user = targetRecord.user;

    if (req.body.email && req.body.email !== user.email) {
      const existing = await db.User.findOne({
        where: { email: req.body.email },
      });
      if (existing) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    let updatedPassword = user.password;
    if (req.body.password) {
      updatedPassword = await bcrypt.hash(req.body.password, 10);
    }

    await user.update({
      name: req.body.name || user.name,
      email: req.body.email || user.email,
      password: updatedPassword,
      contact: req.body.contact || user.contact,
      bio: req.body.bio || user.bio
    });

    if (targetRecord.role.name === "Doctor") {
      await targetRecord.update({
        specialty: req.body.specialty || targetRecord.specialty,
      });
    } else if (targetRecord.role.name === "Staff") {
      await targetRecord.update({
        designation: req.body.designation || targetRecord.designation,
      });
    }

    const { password, ...userWithoutPassword } = user.dataValues;
    res.json({
      message: "User updated successfully",
      user: {
        ...userWithoutPassword,
        role: targetRecord.role,
        hospitalData: {
          specialty: targetRecord.specialty,
          designation: targetRecord.designation,
        },
      },
    });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const loginUser = req.user;
    const hospital_id = req.query.hospitalId;

    if (!loginUser) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!hospital_id) {
      return res
        .status(400)
        .json({ message: "hospital_id is required" });
    }

    const userHospitalRecord = await db.UserHospital.findOne({
      where: { user_id: loginUser.user_id, hospital_id },
      include: [{ model: db.Role, as: "role", attributes: ["name"] }],
    });

    if (!userHospitalRecord) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete users in this hospital." });
    }

    const { id } = req.params;

    const targetRecord = await db.UserHospital.findOne({
      where: { user_id: id, hospital_id },
      include: [
        { model: db.User, as: "user" },
        { model: db.Role, as: "role", attributes: ["name"] },
      ],
    });

    if (!targetRecord) {
      return res
        .status(404)
        .json({ message: "User not found in this hospital" });
    }

    await targetRecord.destroy();

    if (targetRecord.user) {
      await targetRecord.user.destroy();
    }

    res.json({ message: "User removed from hospital successfully" });
  } catch (err) {
    console.error("Delete user error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await db.User.findByPk(req.user.user_id, {
      attributes: ['user_id', 'name', 'email', 'contact'],
      include: [
        {
          model: db.UserHospital,
          as: 'userHospitals',
          include: [
            { model: db.Hospital, as: 'hospital', attributes: ['id', 'name'] },
            { model: db.Role, as: 'role', attributes: ['role_id', 'name'] },
          ],
        },
      ],
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    const hospitals = user.userHospitals.map(uh => ({
      id: uh.hospital.id,
      name: uh.hospital.name,
    }));

    res.json({
      name: user.name,
      email: user.email,
      phone: user.contact,
      role: user.userHospitals[0]?.role?.name || "N/A",
      hospitals,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateMe = async (req, res) => {
  try {
    const user = req.user; 
    const { name, email, phone } = req.body;

    if (email && email !== user.email) {
      const existing = await db.User.findOne({ where: { email } });
      if (existing) return res.status(400).json({ message: "Email already in use" });
    }

    await user.update({
      name: name || user.name,
      email: email || user.email,
      contact: phone || user.contact,
    });

    const { password, ...userWithoutPassword } = user.dataValues;

    res.json({ message: "Profile updated successfully", user: userWithoutPassword });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const changePassword = async (req,res) =>{
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.user_id; 

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "Old and new password required" });
    }

    const user = await db.User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }

}
