import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Standards.module.css";

export default function Standards() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [selectedStandard, setSelectedStandard] = useState(1);

  // Fetch students whenever selectedStandard changes
  useEffect(() => {
    const allStudents = JSON.parse(localStorage.getItem("students") || "[]");
    const filtered = allStudents.filter(
      (student) => student.standard === selectedStandard
    );
    setStudents(filtered);
  }, [selectedStandard]);

  return (
    <div className={styles.layout}>
      <header className={styles.topbar}>
        <div className={styles.headerFlex}>
          <h2>Students in Standard {selectedStandard}</h2>
          <button
            className={styles.backBtn}
            onClick={() => navigate("/admin-dashboard")}
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* Dropdown to change standard dynamically */}
        <div className={styles.standardSelect}>
          <label>Select Standard: </label>
          <select
            value={selectedStandard}
            onChange={(e) => setSelectedStandard(parseInt(e.target.value))}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((s) => (
              <option key={s} value={s}>
                Standard {s}
              </option>
            ))}
          </select>
        </div>
      </header>

      <section className={styles.tableSection}>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Standard</th>
                <th>Progress (%)</th>
                <th>Certificates</th>
              </tr>
            </thead>
            <tbody>
              {students.length ? (
                students.map((student, idx) => (
                  <tr key={idx}>
                    <td>{student.name}</td>
                    <td>{student.email}</td>
                    <td>{student.standard}</td>
                    <td>{typeof student.progress === "number" ? student.progress : 0}</td>
                    <td>{Array.isArray(student.certificates) ? student.certificates.length : 0}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", fontWeight: "bold" }}>
                    No students in this standard.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
