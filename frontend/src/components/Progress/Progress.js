// src/components/Progress.js
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Progress.module.css";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const COLORS = ["#0088FE", "#FFBB28", "#00C49F", "#FF8042"];

export default function Progress() {
  const navigate = useNavigate();
  const [student, setStudent] = useState({});
  const [subjectProgress, setSubjectProgress] = useState([]);
  const [overallProgress, setOverallProgress] = useState(0);

  const loadProgressData = useCallback(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user.email) return;
    setStudent(user);

    const students = JSON.parse(localStorage.getItem("students") || "[]");
    const currentStudent =
      students.find((s) => s.email === user.email) || { courses: [] };

    // 🧮 Calculate progress dynamically
    let totalQuizzes = 0;
    let completedQuizzes = 0;
    const subjProg = [];

    currentStudent.courses.forEach((course) => {
      const quizzes = course.quizzes || [];
      const total = quizzes.length;
      const completed = quizzes.filter((q) => q.completed === true).length;
      const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

      subjProg.push({
        subject: course.subject,
        completed,
        total,
        percent,
      });

      totalQuizzes += total;
      completedQuizzes += completed;
    });

    // 🎯 Compute actual overall completion %
    const completionPercent =
      totalQuizzes > 0 ? Math.round((completedQuizzes / totalQuizzes) * 100) : 0;

    setSubjectProgress(subjProg);
    setOverallProgress(completionPercent);
  }, []);

  useEffect(() => loadProgressData(), [loadProgressData]);

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (["students", "lastQuizScore", "quizScores"].includes(event.key))
        loadProgressData();
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [loadProgressData]);

  const overallProgressData = [
    { name: "Completed", value: overallProgress },
    { name: "Remaining", value: 100 - overallProgress },
  ];

  return (
    <div className={styles.wrapper}>
      <button className={styles.backBtn} onClick={() => navigate(-1)}>
        ← Back
      </button>
      <h2>Progress Overview</h2>

      <div className={styles.summary}>
        <div>
          <strong>Student:</strong> {student.name || "Student"}
        </div>
        <div>
          <strong>Overall Progress:</strong> {overallProgress}%
        </div>
        <div>
          <strong>Subjects:</strong> {subjectProgress.length}
        </div>
      </div>

      {/* ✅ Overall Progress Chart */}
      <div className={styles.overallChart}>
        <h3>Overall Progress Chart</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={overallProgressData}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={100}
              dataKey="value"
              label
            >
              {overallProgressData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* ✅ Subject-wise Progress */}
      <div className={styles.progressCharts}>
        {subjectProgress.length > 0 ? (
          subjectProgress.map((subj, idx) => (
            <div key={idx} className={styles.chartCard}>
              <h3>{subj.subject}</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={[subj]}>
                  <XAxis dataKey="subject" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="percent" fill="#4caf50" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <p>
                {subj.completed} / {subj.total} quizzes completed (
                {subj.percent}%)
              </p>
            </div>
          ))
        ) : (
          <p className={styles.noData}>No subject progress available yet.</p>
        )}
      </div>
    </div>
  );
}
