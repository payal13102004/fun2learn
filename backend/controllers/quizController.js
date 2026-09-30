import Quiz from "../models/Quiz.js";

export const getQuizByCourse = async (req, res) => {
  const quiz = await Quiz.findOne({ course: req.params.courseId });
  if (!quiz) return res.status(404).json({ message: "Quiz not found" });
  res.json(quiz);
};

export const submitQuiz = async (req, res) => {
  const { answers } = req.body; // array of selected indices
  const quiz = await Quiz.findById(req.params.quizId);
  let score = 0;
  quiz.questions.forEach((q, i) => {
    if (answers[i] === q.answer) score++;
  });
  res.json({ score, total: quiz.questions.length });
};