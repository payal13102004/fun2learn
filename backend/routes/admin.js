import express from "express";
import User from "../models/User.js";
import Course from "../models/Course.js"; // your Course model
import Certificate from "../models/Certificate.js"; // your Certificate model
import jwt from "jsonwebtoken";

const router = express.Router();

// Middleware
const verifyAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    if (decoded.role !== "admin") return res.status(403).json({ message: "Not authorized" });
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// GET stats
router.get("/stats", verifyAdmin, async (req, res) => {
  try {
    const totalCourses = await Course.countDocuments();
    const totalStudents = await User.countDocuments({ role: "student" });
    const certificates = await Certificate.countDocuments();

    res.json({ totalCourses, totalStudents, certificates });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
