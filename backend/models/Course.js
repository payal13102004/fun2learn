import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lesson" }],
  quizzes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Quiz" }]
}, { timestamps: true });

export default mongoose.model("Course", courseSchema);