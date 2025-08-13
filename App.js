import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./models/index.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json()); 

app.use(cors({
  origin: "http://localhost:3000", 
  credentials: true
}));

// app.use("/api/superadmin", superAdminRoutes);
// app.use("/api/hospitals", hospitalRoutes);

db.sequelize.sync({ alter: true })
  .then(() => {
    console.log(" MySQL connected & tables synced");

    app.listen(PORT, () => {
      console.log(` Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error(" DB connection error:", err);
  });
