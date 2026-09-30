import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: String,
  role: { type: String, enum: ["student", "admin"], default: "student" },
  standard: { type: Number, min: 1, max: 10 },
  badges: [String],
  achievements: [String],
  enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
  points: { type: Number, default: 0 },
  videosWatched: { type: Number, default: 0 },
  watchedVideos: [Number],
  quizScores: [{
    subject: String,
    standard: Number,
    score: Number,
    correctAnswers: Number,
    incorrectAnswers: Number,
    totalQuestions: Number,
    date: String,
  }],
  progress: [{ course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" }, percent: Number }]
}, { timestamps: true });

export default mongoose.model("User", userSchema);