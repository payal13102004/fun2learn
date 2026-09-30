import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema({
  type: { type: String, enum: ["video", "text", "game"], required: true },
  title: String,
  content: String,
  videoUrl: String
});

export default mongoose.model("Lesson", lessonSchema);