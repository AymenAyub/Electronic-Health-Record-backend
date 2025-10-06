import db from "../models/index.js";
export const registerHospital = async (req, res) => {
  try {
    const user = req.user; 
    const { name, email, phone, address } = req.body;

    const ownerRole = await db.Role.findOne({ where: { name: "Owner" } });
    if (!ownerRole) {
      return res.status(500).json({ message: "Owner role not found, seed it first." });
    }

    const userHospital = await db.UserHospital.findOne({
      where: { user_id: user.user_id, role_id: ownerRole.role_id }
    });

    if (!userHospital) {
      return res.status(403).json({ message: "Only Owners can register hospitals" });
    }

    const existingEmail = await db.Hospital.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(409).json({ message: "Email already taken" });
    }

    const newHospital = await db.Hospital.create({
      name,
      email,
      phone,
      address,
      isActive: true
    });

let existingUserHospital = await db.UserHospital.findOne({
  where: { user_id: user.user_id, hospital_id: null, role_id: ownerRole.role_id }
});

if (existingUserHospital) {
  userHospital.hospital_id = newHospital.id;
  await userHospital.save();
} else {
  await db.UserHospital.create({
    user_id: user.user_id,
    hospital_id: newHospital.id,
    role_id: ownerRole.role_id
  });
}

    res.status(201).json({
      message: "Hospital registered successfully",
      hospital: newHospital,
      role: { id: ownerRole.role_id, name: ownerRole.name }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const getMyHospital = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(403).json({ message: "Unauthorized" });
    console.log(user.id);

    const { hospital_id } = req.params; 

    if (!hospital_id) return res.status(400).json({ message: "hospital_id is required" });

    const userHospital = await db.UserHospital.findOne({
      where: { user_id: user.dataValues.user_id, hospital_id },
      include: [{ model: db.Hospital,
        as :'hospital'

       }]
    });

    if (!userHospital)
      return res.status(404).json({ message: "Hospital not found or access denied" });

    const hospital = {
      hospital_id: userHospital.hospital.id,
      name: userHospital.hospital.name,
      role: userHospital.role
    };

    return res.json({ hospital });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message:
       "Server error" });
  }
};


export const checkHospital = async (req, res) => {
  try {
    const user = req.user; 

    if (!user) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const userHospitals = await db.UserHospital.findAll({
      where: { user_id: user.dataValues.user_id },
      include: [{
        model: db.Hospital ,
        as : 'hospital',
        attributes: ["id", "name", "email", "phone", "address"]
      }]
    });

    if (!userHospitals || userHospitals.length === 0) {
      return res.json({ hasHospital: false, hospitals: [] });
    }

    const hospitals = userHospitals.map(uh => ({
      id: uh.hospital.id,
      name: uh.hospital.name,
      address: uh.hospital.address, 
      role: uh.role,
    }));
    

    return res.json({ hasHospital: true, hospitals });
  } catch (err) {
    console.error("checkHospitals error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

