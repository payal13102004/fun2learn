import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  subject: { type: String },
  standard: { type: Number },
  score: { type: Number },
  correctAnswers: { type: Number },
  incorrectAnswers: { type: Number },
  totalQuestions: { type: Number },
  date: { type: String },
}, { timestamps: true });

export default mongoose.model("Certificate", certificateSchema);