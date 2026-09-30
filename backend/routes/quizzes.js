import express from "express";
import { getQuizByCourse, submitQuiz } from "../controllers/quizController.js";
import { authenticate } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/:courseId", getQuizByCourse);
router.post("/:quizId/submit", authenticate, submitQuiz);

export default router;