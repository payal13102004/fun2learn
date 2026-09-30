import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import adminDashboardRoutes from "./routes/adminDashboard.js";
import certificateRoutes from "./routes/certificates.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/admin-dashboard", adminDashboardRoutes);

app.get("/", (req, res) => res.send("Fun2Learn API running"));

export default app;