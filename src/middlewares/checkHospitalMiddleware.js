export const checkHospitalMiddleware = async (req, res, next) => {
    try {
      const adminUser = req.user;
  
      if (!adminUser?.hospital_id) {
        return res.status(403).json({
          message: "You must add a hospital before performing this action",
        });
      }
  
      const hospital = await db.Hospital.findByPk(adminUser.hospital_id);
  
      if (!hospital) {
        return res.status(403).json({
          message: "Invalid hospital. Please add a hospital first.",
        });
      }
  
      req.hospital = hospital;
      next();
    } catch (err) {
      console.error("checkHospital middleware error:", err);
      return res.status(500).json({ error: "Server error" });
    }
  };
  