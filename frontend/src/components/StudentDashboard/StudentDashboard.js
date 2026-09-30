import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./StudentDashboard.module.css";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUserGraduate,
  FaTrophy,
  FaChartLine,
  FaBookOpen,
  FaQuestionCircle,
  FaSignOutAlt,
  FaBook,
  FaVideo,
} from "react-icons/fa";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#00C49F", "#FFBB28", "#0088FE", "#FF8042"];

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [student, setStudent] = useState({});
  const [certificates, setCertificates] = useState([]);
  const [progress, setProgress] = useState(0);
  const [videosWatched, setVideosWatched] = useState(0);
  const [courseProgress, setCourseProgress] = useState([]);
  const [newCertificate, setNewCertificate] = useState(null);
  const [showToast, setShowToast] = useState(false);

  // 🔹 Load and calculate all progress dynamically
  const loadDashboardData = useCallback(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user.email) return;

    let students = JSON.parse(localStorage.getItem("students") || "[]");
    let currentStudent = students.find((s) => s.email === user.email);

    if (!currentStudent) {
      currentStudent = {
        email: user.email,
        name: user.name,
        courses: [],
        certificates: [],
        videosWatched: 0,
      };
      students.push(currentStudent);
    }

    let totalQuizzes = 0;
    let completedQuizzes = 0;
    const perCourseProgress = [];
    const earnedCertificates = [];

    // ✅ Calculate quiz progress + certificate eligibility
    (currentStudent.courses || []).forEach((course) => {
      const quizzes = course.quizzes || [];
      const total = quizzes.length;
      const completed = quizzes.filter((q) => q.completed).length;
      const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

      perCourseProgress.push({
        subject: course.subject || "Unknown",
        percent,
        completed,
        total,
      });

      totalQuizzes += total;
      completedQuizzes += completed;

      const certTitle = `Certificate of Completion - ${course.subject}`;

      // 🏆 Add certificate if fully completed
      if (total > 0 && completed === total) {
        if (!currentStudent.certificates.some((c) => c.title === certTitle)) {
          const newCert = {
            title: certTitle,
            date: new Date().toLocaleDateString(),
          };
          currentStudent.certificates.push(newCert);
          setNewCertificate(newCert);
          setShowToast(true);
          setTimeout(() => setShowToast(false), 4000);
        }
        earnedCertificates.push(certTitle);
      }
    });

    // ❌ Remove unearned certificates
    currentStudent.certificates = currentStudent.certificates.filter((c) =>
      earnedCertificates.includes(c.title)
    );

    const newProgress =
      totalQuizzes > 0 ? Math.round((completedQuizzes / totalQuizzes) * 100) : 0;

    setProgress(newProgress);
    setCourseProgress(perCourseProgress);
    setCertificates(currentStudent.certificates);
    setVideosWatched(currentStudent.videosWatched || 0);
    setStudent(currentStudent);

    const updatedStudents = students.map((s) =>
      s.email === user.email ? currentStudent : s
    );
    localStorage.setItem("students", JSON.stringify(updatedStudents));
  }, []);

  useEffect(() => loadDashboardData(), [loadDashboardData]);

  // Refresh when data changes in another tab
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (["students", "user"].includes(e.key)) loadDashboardData();
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [loadDashboardData]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const progressData = [
    { name: "Completed", value: progress },
    { name: "Remaining", value: 100 - progress },
  ];

  const certificateData = [
    { name: "Earned", value: certificates.length },
    { name: "Remaining", value: Math.max(0, 5 - certificates.length) },
  ];

  return (
    <div className={styles.layout}>
      <AnimatePresence>
        {showToast && newCertificate && (
          <motion.div
            className={styles.toast}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ type: "spring", stiffness: 120 }}
          >
            🎉 New Certificate Unlocked: {newCertificate.title}!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <FaTrophy /> Fun2Learn
        </div>
        <nav>
          <button onClick={() => navigate("/mycourses")} className={styles.navBtn}>
            <FaBookOpen /> My Courses
          </button>
          <button onClick={() => navigate("/progress")} className={styles.navBtn}>
            <FaChartLine /> Progress
          </button>
          <button onClick={() => navigate("/achievements")} className={styles.navBtn}>
            <FaTrophy /> Achievements
          </button>
          <button onClick={() => navigate("/books")} className={styles.navBtn}>
            <FaBook /> Books
          </button>
          <button onClick={() => navigate("/videos")} className={styles.navBtn}>
            <FaVideo /> Videos
          </button>
          <button onClick={() => navigate("/quiz")} className={styles.navBtn}>
            <FaQuestionCircle /> Quiz
          </button>
          <button onClick={() => navigate("/student-profile")} className={styles.navBtn}>
            <FaUserGraduate /> Profile
          </button>
          <button onClick={handleLogout} className={styles.navBtn}>
            <FaSignOutAlt /> Logout
          </button>
        </nav>
      </aside>

      {/* Main Section */}
      <main className={styles.main}>
        <header className={styles.topbar}>
          <div className={styles.title}>
            Student Dashboard {student.standard ? `- Std ${student.standard}` : ""}
          </div>
          <div className={styles.userInfo}>
            {student.profilePic ? (
              <img src={student.profilePic} alt="Profile" className={styles.profilePic} />
            ) : (
              <FaUserGraduate className={styles.defaultProfileIcon} />
            )}
            <span>Welcome, {student.name || "Student"}</span>
          </div>
        </header>

        {/* Charts */}
        <section className={styles.chartsSection}>
          <div className={styles.chartCard}>
            <h3>📊 Quiz Progress</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={progressData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  dataKey="value"
                  label
                >
                  {progressData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className={styles.chartCard}>
            <h3>🏆 Certificates Earned</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={certificateData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  dataKey="value"
                  label
                >
                  {certificateData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* 📘 Course-wise Progress */}
        <section className={styles.courseProgress}>
          <h3>📘 Course-wise Progress</h3>
          {courseProgress.length > 0 ? (
            courseProgress.map((course, idx) => (
              <div key={idx} className={styles.courseBar}>
                <div className={styles.courseHeader}>
                  <span>{course.subject}</span>
                  <span>{course.percent}%</span>
                </div>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${course.percent}%` }}
                  ></div>
                </div>
                <small>
                  {course.completed}/{course.total} quizzes completed
                </small>
              </div>
            ))
          ) : (
            <p>No courses available yet.</p>
          )}
        </section>

        {/* Summary */}
        <section className={styles.summarySection}>
          <div>
            <strong>Overall Progress:</strong> {progress}%
          </div>
          <div>
            <strong>Videos Watched:</strong> {videosWatched}
          </div>
          <div>
            <strong>Certificates Earned:</strong> {certificates.length}
          </div>
        </section>
      </main>
    </div>
  );
}
