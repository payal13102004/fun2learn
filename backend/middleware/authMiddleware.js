// backend/middleware/authMiddleware.js
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;

// ---------------- Register ----------------
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  // Prevent direct admin registration
  if (email === adminEmail) {
    return res.status(400).json({ message: "Cannot register as admin." });
  }

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "Email already registered." });
    }

    const hashed = await bcrypt.hash(password, 10);
    user = await User.create({ name, email, password: hashed, role: "student" });

    res.status(201).json({ message: "Registration successful" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------- Login ----------------
export const login = async (req, res) => {
  const { email, password } = req.body;

  // Admin login (from .env)
  if (email === adminEmail) {
    if (password === adminPassword) {
      const token = jwt.sign(
        { id: "admin", role: "admin", email },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );
      return res.json({
        token,
        user: { id: "admin", name: "Admin", email, role: "admin" },
      });
    } else {
      return res.status(400).json({ message: "Invalid credentials" });
    }
  }

  // Student login
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({
    token,
    user: { id: user._id, name: user.name, email, role: user.role },
  });
};

// ---------------- Authenticate Middleware ----------------
export const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach user info to request
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// ---------------- Admin Check Middleware ----------------
export const isAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Access denied: Admins only" });
  }
  next();
};
