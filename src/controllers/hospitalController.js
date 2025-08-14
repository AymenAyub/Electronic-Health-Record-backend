import db from "../models/index.js";

export const registerHospital = async (req, res) => {
  try {
    const adminUser = req.user;
    const { name, email, subdomain, phone, address } = req.body;
    const existingSubdomain = await db.Hospital.findOne({
      where: {
        subdomain: subdomain
      }
    });

    if (existingSubdomain) {
      return res.status(409).json({ message: "Subdomain already taken" });
    }

    const existingEmail = await db.Hospital.findOne({
      where: {
       email:email
      }
    });

    if (existingEmail) {
      return res.status(409).json({ message: "Email already taken" });
    }

    if (adminUser.hospital_id) {
      return res.status(400).json({ message: "You can register only one hospital for now." });
    }

    const newHospital = await db.Hospital.create({
      name,
      email,
      subdomain,
      phone,
      address,
      isActive: true
    });

    
    adminUser.hospital_id = newHospital.id;
    await adminUser.save();

    res.status(201).json({
      message: "Hospital registered successfully",
      hospital: newHospital
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
