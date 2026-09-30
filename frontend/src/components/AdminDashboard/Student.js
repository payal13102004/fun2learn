// src/components/AdminDashboard/Students.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Student.module.css";

export default function Students() {
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all registered users from localStorage
    const allUsers = JSON.parse(localStorage.getItem("students") || "[]"); // Use the same key as registration

    // Filter only students
    const filtered = allUsers.filter((u) => u.role === "student");
    setStudents(filtered);
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>🎓 Registered Students</h1>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Sr. No</th>
            <th>Name</th>
            <th>Email ID</th>
            <th>Standard</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {students.length > 0 ? (
            students.map((student, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>{student.standard}</td>
                <td>{student.role}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className={styles.noData}>
                No students found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <button
        className={styles.backBtn}
        onClick={() => navigate("/admin-dashboard")}
      >
        ⬅ Back to Dashboard
      </button>
    </div>
  );
}
