import express from "express";
import { getCourses, getCourse, createCourse } from "../controllers/courseController.js";
import { authenticate, isAdmin } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/", getCourses);
router.get("/:id", getCourse);
router.post("/", authenticate, isAdmin, createCourse);

export default router;