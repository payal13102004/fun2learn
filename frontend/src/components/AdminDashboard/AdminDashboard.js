import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./AdminDashboard.module.css";
import {
  FaUserGraduate,
  FaBook,
  FaCertificate,
  FaChartBar,
  FaCog,
  FaBookOpen,
  FaTrophy,
  FaVideo,
  FaQuestionCircle,
  FaRocket,
} from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  CartesianGrid,
} from "recharts";

export default function AdminDashboard() {
  const location = useLocation();
  const [adminName, setAdminName] = useState("Admin");
  const [profilePic, setProfilePic] = useState("");
  const [students, setStudents] = useState([]);
  const [studentCount, setStudentCount] = useState(0);
  const [certificateCount, setCertificateCount] = useState(0);
  const [books, setBooks] = useState([]);

  const [stats, setStats] = useState({
    standards: Array.from({ length: 10 }, (_, i) => ({
      standard: i + 1,
      count: 0,
    })),
    activeStandard: 1,
    courses: 0,
  });

  const COLORS = ["#4fc3f7", "#69f0ae"];

  // 🧮 Calculate progress per student based on completed quizzes
  const calculateProgress = (student) => {
    let totalQuizzes = 0;
    let completedQuizzes = 0;

    (student.courses || []).forEach((course) => {
      const quizzes = course.quizzes || [];
      totalQuizzes += quizzes.length;
      completedQuizzes += quizzes.filter((q) => q.completed).length;
    });

    return totalQuizzes > 0
      ? Math.round((completedQuizzes / totalQuizzes) * 100)
      : 0;
  };

  // 📚 Load students and refresh stats
  const loadStudents = () => {
    const allStudents = JSON.parse(localStorage.getItem("students") || "[]");

    setStudents(allStudents);
    setStudentCount(allStudents.length);

    const totalCertificates = allStudents.reduce(
      (acc, s) => acc + (s.certificates?.length || 0),
      0
    );
    setCertificateCount(totalCertificates);

    // Group by standard
    const updatedStandards = stats.standards.map((std) => ({
      ...std,
      count: allStudents.filter((s) => s.standard === std.standard).length,
    }));

    const mostActiveStandard =
      updatedStandards.reduce((a, b) => (a.count > b.count ? a : b), updatedStandards[0])
        .standard;

    setStats({
      ...stats,
      standards: updatedStandards,
      activeStandard: mostActiveStandard,
      courses: allStudents.reduce(
        (acc, s) => acc + (s.courses?.length || 0),
        0
      ),
    });
  };

  // 📘 Load Books
  const loadBooks = () => {
    const storedBooks = JSON.parse(localStorage.getItem("books") || "[]");
    setBooks(storedBooks);
  };

  // 🔁 Auto-refresh when students or quiz data changes
  useEffect(() => {
    const savedSettings = JSON.parse(localStorage.getItem("adminSettings")) || {};
    setAdminName(savedSettings.username || "Admin");
    setProfilePic(savedSettings.profilePic || "");

    loadStudents();
    loadBooks();

    const handleStorageChange = (event) => {
      if (["students", "books"].includes(event.key)) {
        loadStudents();
        loadBooks();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [location]);

  // 📊 Charts Data
  const activityPie = [
    { name: "Active", value: students.filter((s) => calculateProgress(s) > 0).length },
    { name: "Inactive", value: students.filter((s) => calculateProgress(s) === 0).length },
  ];

  const quizPerformanceData = students.map((s) => ({
    name: s.name,
    progress: calculateProgress(s),
    certificates: s.certificates?.length || 0,
  }));

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.logoSide}>
          <FaTrophy /> Fun2Learn
        </div>
        <nav>
          <Link
            className={location.pathname === "/admin-dashboard" ? styles.active : ""}
            to="/admin-dashboard"
          >
            <FaChartBar /> Dashboard
          </Link>
          <Link to="/students">
            <FaUserGraduate /> Students
          </Link>
          <Link to="/admin-books">
            <FaBook /> Books
          </Link>
          <Link to="/admin-quizzes">
            <FaQuestionCircle /> Quizzes
          </Link>
          <Link to="/admin-videos">
            <FaVideo /> Videos
          </Link>
          <Link to="/settings">
            <FaCog /> Settings
          </Link>
          <Link to="/future-enhancements">
            <FaRocket /> Future Plans
          </Link>
        </nav>
      </aside>

      {/* Main */}
      <main className={styles.main}>
        <header className={styles.topbar}>
          <div className={styles.logoMain}>
            <FaTrophy /> Fun2Learn
          </div>
          <div className={styles.profileMenu}>
            <img
              src={profilePic || "https://via.placeholder.com/40"}
              alt="Admin"
              className={styles.profileAvatar}
            />
            <span>{adminName}</span>
          </div>
        </header>

        {/* Summary */}
        <section className={styles.statsRow}>
          <div className={styles.statCard}>
            <FaUserGraduate />
            <div>
              <h3>{studentCount}</h3>
              <p>Students</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <FaBookOpen />
            <div>
              <h3>10</h3>
              <p>Standards</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <FaCertificate />
            <div>
              <h3>{certificateCount}</h3>
              <p>Certificates</p>
            </div>
          </div>
        </section>

        {/* Charts */}
        <section className={styles.chartsSection}>
          <h3>📊 Student Performance Overview</h3>
          <div className={styles.chartsGrid}>
            <div className={styles.chartCard}>
              <h4>Progress & Certificates</h4>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={quizPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="progress" fill="#4fc3f7" name="Progress %" />
                  <Bar dataKey="certificates" fill="#69f0ae" name="Certificates" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className={styles.chartCard}>
              <h4>Student Activity</h4>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={activityPie} dataKey="value" outerRadius={80} label>
                    {activityPie.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* 🧾 Student Table */}
        <section className={styles.tableSection}>
          <h3>📋 Student Progress Table</h3>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Standard</th>
                <th>Email</th>
                <th>Progress %</th>
                <th>Certificates</th>
                <th>Videos Watched</th>
              </tr>
            </thead>
            <tbody>
              {students.length > 0 ? (
                students.map((s, idx) => (
                  <tr key={idx}>
                    <td>{s.name}</td>
                    <td>{s.standard}</td>
                    <td>{s.email}</td>
                    <td>{calculateProgress(s)}%</td>
                    <td>{s.certificates?.length || 0}</td>
                    <td>{s.videosWatched || 0}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    No students registered yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}
