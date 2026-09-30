import Course from "../models/Course.js";
import Lesson from "../models/Lesson.js";

export const getCourses = async (req, res) => {
  const courses = await Course.find().populate("lessons");
  res.json(courses);
};

export const getCourse = async (req, res) => {
  const course = await Course.findById(req.params.id).populate("lessons quizzes");
  if (!course) return res.status(404).json({ message: "Not found" });
  res.json(course);
};

export const createCourse = async (req, res) => {
  const { title, description } = req.body;
  const course = await Course.create({ title, description });
  res.status(201).json(course);
};