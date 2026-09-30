// src/components/MyCourse/MyCourses.js
import React, { useEffect, useState } from "react";
import styles from "./MyCourses.module.css";

export default function MyCourses() {
  const [courses, setCourses] = useState([]);
  const [student, setStudent] = useState({});

  // 🧠 Load courses dynamically from admin + filter by student standard
  const loadCourses = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user.email) return;

    setStudent(user);

    // ✅ Fetch all courses from admin side
    const adminCourses = JSON.parse(localStorage.getItem("allCourses") || "[]");

    // 🧍‍♂️ Fetch all students
    let students = JSON.parse(localStorage.getItem("students") || "[]");
    let currentStudent = students.find((s) => s.email === user.email);

    // 👶 If student doesn't exist, create a new record
    if (!currentStudent) {
      currentStudent = {
        email: user.email,
        name: user.name,
        standard: user.standard || 1, // fallback if not set
        courses: [],
      };
      students.push(currentStudent);
    }

    // 🎯 Filter admin courses by student's standard
    const filteredAdminCourses = adminCourses.filter(
      (course) => course.standard === currentStudent.standard
    );

    // 🔁 Merge with student's existing progress
    const updatedCourses = filteredAdminCourses.map((course) => {
      const existing = currentStudent.courses?.find((c) => c.id === course.id);
      return existing || { ...course, progress: 0 };
    });

    // 💾 Update student record in localStorage
    currentStudent.courses = updatedCourses;
    const updatedStudents = students.map((s) =>
      s.email === user.email ? currentStudent : s
    );
    localStorage.setItem("students", JSON.stringify(updatedStudents));

    // 🧩 Update UI
    setCourses(updatedCourses);
  };

  useEffect(() => {
    loadCourses();

    // 🔁 Auto refresh if admin updates courses
    const handleStorageChange = (e) => {
      if (e.key === "allCourses") loadCourses();
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // 📈 Update course progress
  const updateProgress = (courseId, delta = 10) => {
    const updatedCourses = courses.map((course) =>
      course.id === courseId
        ? { ...course, progress: Math.max(0, Math.min(100, (course.progress || 0) + delta)) }
        : course
    );
    setCourses(updatedCourses);

    // Sync changes to localStorage
    const students = JSON.parse(localStorage.getItem("students") || "[]");
    const index = students.findIndex((s) => s.email === student.email);
    if (index !== -1) {
      students[index].courses = updatedCourses;
      localStorage.setItem("students", JSON.stringify(students));
    }
  };

  const getProgressColor = (value) => {
    if (value < 40) return "#e74c3c";
    if (value < 70) return "#f1c40f";
    return "#2ecc71";
  };

  return (
    <div className={styles.container}>
      <h1>📚 My Courses</h1>

      {student.standard && (
        <h3 className={styles.subHeading}>
          Standard {student.standard}
        </h3>
      )}

      {courses.length === 0 ? (
        <p className={styles.emptyMessage}>
          No courses available for your standard yet. Please check back later!
        </p>
      ) : (
        <div className={styles.courseList}>
          {courses.map((course) => (
            <div key={course.id} className={styles.courseCard}>
              <h3>{course.name}</h3>
              <p>{course.description || "No description available."}</p>

              <div className={styles.progressBar}>
                <div
                  className={styles.progress}
                  style={{
                    width: `${course.progress || 0}%`,
                    backgroundColor: getProgressColor(course.progress || 0),
                  }}
                >
                  {course.progress || 0}%
                </div>
              </div>

              <div className={styles.progressButtons}>
                <button
                  className={styles.incBtn}
                  onClick={() => updateProgress(course.id, 10)}
                >
                  +10%
                </button>
                <button
                  className={styles.decBtn}
                  onClick={() => updateProgress(course.id, -10)}
                >
                  -10%
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <button className={styles.backBtn} onClick={() => window.history.back()}>
        ⬅ Back to Dashboard
      </button>
    </div>
  );
}
