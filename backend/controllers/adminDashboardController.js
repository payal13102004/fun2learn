import User from "../models/User.js";
import Course from "../models/Course.js";
import Certificate from "../models/Certificate.js";
import Quiz from "../models/Quiz.js";

// Dashboard Stats
export const getDashboardStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalCourses = await Course.countDocuments();
    const totalCertificates = await Certificate.countDocuments();

    // Students per standard (1–10)
    const standards = [];
    let mostActiveStandard = { standard: null, count: 0 };
    for (let s = 1; s <= 10; s++) {
      const count = await User.countDocuments({ role: "student", standard: s });
      standards.push({ standard: s, count });
      if (count > mostActiveStandard.count) {
        mostActiveStandard = { standard: s, count };
      }
    }

    res.json({
      totalStudents,
      totalCourses,
      totalCertificates,
      standards,
      mostActiveStandard: mostActiveStandard.standard
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Bar Chart: Students per Standard
export const getStudentsPerStandard = async (req, res) => {
  try {
    const data = [];
    for (let s = 1; s <= 10; s++) {
      const count = await User.countDocuments({ role: "student", standard: s });
      data.push({ standard: s, count });
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Line Chart: Average Quiz Scores by Standard
export const getAvgQuizScoresByStandard = async (req, res) => {
  try {
    let result = [];
    for (let s = 1; s <= 10; s++) {
      // Get all students in this standard
      const students = await User.find({ role: "student", standard: s }).select("_id");
      const studentIds = students.map(u => u._id);

      // Get all quizzes attempted by these students (simulate: assume you store attempts with score & standard)
      // For demo: random values
      const avg = Math.floor(Math.random() * 30) + 60; // 60-90%
      result.push({ standard: s, avg });
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Pie Chart: Active vs Inactive Students
export const getActiveInactiveStudents = async (req, res) => {
  try {
    // For demo: active = logged in within last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const active = await User.countDocuments({
      role: "student",
      updatedAt: { $gte: thirtyDaysAgo }
    });
    const inactive = await User.countDocuments({
      role: "student",
      updatedAt: { $lt: thirtyDaysAgo }
    });
    res.json([
      { name: "Active", value: active },
      { name: "Inactive", value: inactive }
    ]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Students Table (pagination, search)
export const getStudentsTable = async (req, res) => {
  try {
    // Pagination & search params
    const { page = 1, limit = 10, search = "" } = req.query;
    const query = {
      role: "student",
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ]
    };

    const students = await User.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .select("name email standard progress achievements");
    const total = await User.countDocuments(query);

    // For each student, calculate progress (%) and certificates earned
    const data = await Promise.all(students.map(async (stu) => {
      const certificates = await Certificate.countDocuments({ student: stu._id });
      const progress =
        stu.progress && stu.progress.length
          ? Math.round(stu.progress.reduce((a, b) => a + (b.percent || 0), 0) / stu.progress.length)
          : 0;
      return {
        id: stu._id,
        name: stu.name,
        email: stu.email,
        standard: stu.standard,
        progress,
        certificates
      };
    }));

    res.json({ data, total });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};