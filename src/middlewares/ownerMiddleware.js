
export const isOwner = (req, res, next) => {
    try {
      const user = req.user;
  
      if (!user) {
        return res.status(401).json({ message: "Unauthorized. No user found." });
      }
  
      if (user.role !== "Owner") {
        return res.status(403).json({ message: "Access denied. Owners only." });
      }
  
      next();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error in isOwner middleware" });
    }
  };
  