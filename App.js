import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./src/models/index.js";
import userRoutes from "./src/routes/userRoutes.js";
import hospitalRoutes from "./src/routes/hospitalRoutes.js";
import dashboardRoutes from "./src/routes/DashboardRoutes.js";
import patientRoutes from "./src/routes/patientRoutes.js";
import appointmentRoutes from "./src/routes/appointmentRoutes.js";
import doctorAvailabilityRoutes from "./src/routes/doctorAvailabilityRoutes.js";
import doctorRoutes from "./src/routes/doctorRoutes.js";
// import medicalHistoryRoutes from "./src/routes/medicalHistoryRoutes.js";
import roleRoutes from "./src/routes/roleRoutes.js";
import permissionRoutes from "./src/routes/permissionRoutes.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json()); 

app.use(cors({
  origin: "http://localhost:3000", 
  credentials: true
}));

app.use("/api", userRoutes);
app.use("/api/hospital", hospitalRoutes);
// app.use("/api",dashboardRoutes)
app.use("/api",patientRoutes);
app.use("/api", appointmentRoutes);
app.use("/api", doctorAvailabilityRoutes);
app.use("/api", doctorRoutes);
// app.use("/api", medicalHistoryRoutes);
app.use("/api", roleRoutes);
app.use("/api", permissionRoutes);


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
