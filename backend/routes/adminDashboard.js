import express from "express";
import {
  getDashboardStats,
  getStudentsPerStandard,
  getAvgQuizScoresByStandard,
  getActiveInactiveStudents,
  getStudentsTable
} from "../controllers/adminDashboardController.js";
import { authenticate, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/stats", authenticate, isAdmin, getDashboardStats);
router.get("/students-per-standard", authenticate, isAdmin, getStudentsPerStandard);
router.get("/avg-quiz-scores", authenticate, isAdmin, getAvgQuizScoresByStandard);
router.get("/active-inactive-students", authenticate, isAdmin, getActiveInactiveStudents);
router.get("/students-table", authenticate, isAdmin, getStudentsTable);

export default router;