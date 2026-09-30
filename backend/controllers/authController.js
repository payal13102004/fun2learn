import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

// REGISTER (only students can register)
export const register = async (req, res) => {
  const { name, email, password, standard } = req.body;
  try {
    let existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: "student",
      standard: standard || 1,
    });

    await user.save();

    // Return token + user so frontend can auto-login
    const token = jwt.sign(
      { id: user._id, role: "student" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({
      message: "Student registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        standard: user.standard,
      },
    });
  } catch (err) {
    console.error("Register error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// LOGIN (admin OR student)
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    console.log("🔑 Login attempt:", email, password);
    console.log("⚙️ Admin from .env:", process.env.ADMIN_EMAIL, process.env.ADMIN_PASSWORD);

    // 1. Check for admin login
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign({ email, role: "admin" }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      console.log("✅ Admin login successful");
      return res.json({
        token,
        user: { email, role: "admin" },
      });
    }

    // 2. Otherwise check student in DB
    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ No student found with email:", email);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("❌ Wrong password for:", email);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role || "student" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    console.log("✅ Student login successful:", email);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || "student",
      },
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};
