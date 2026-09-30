// src/components/StudentProfile/StudentProfile.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import imageCompression from "browser-image-compression";
import styles from "./StudentProfile.module.css";

export default function StudentProfile() {
  const [user, setUser] = useState({});
  const [editData, setEditData] = useState({
    name: "",
    email: "",
    standard: "",
    contact: "",
    profilePic: "",
  });
  const [progress, setProgress] = useState(0);
  const [certificates, setCertificates] = useState([]);
  const navigate = useNavigate();

  // 🔹 Load student data
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    const students = JSON.parse(localStorage.getItem("students") || "[]");
    const found = students.find((s) => s.email === userData.email) || userData;

    if (found) {
      setUser(found);
      setEditData({
        name: found.name || "",
        email: found.email || "",
        standard: found.standard || "",
        contact: found.contact || "",
        profilePic: found.profilePic || "",
      });

      // 🧮 Calculate progress dynamically
      let total = 0,
        completed = 0;
      found.courses?.forEach((c) => {
        total += c.quizzes?.length || 0;
        completed += c.quizzes?.filter((q) => q.completed).length || 0;
      });
      const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
      setProgress(percent);

      // 🎓 Load certificates
      setCertificates(found.certificates || []);
    }
  }, []);

  // 🔙 Go back
  const handleBack = () => navigate("/student-dashboard");

  // ✏️ Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  // 🖼️ Profile Picture Upload with Compression
  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const compressed = await imageCompression(file, {
          maxSizeMB: 0.1,
          maxWidthOrHeight: 250,
          useWebWorker: true,
        });
        const reader = new FileReader();
        reader.onloadend = () => {
          setEditData((prev) => ({ ...prev, profilePic: reader.result }));
        };
        reader.readAsDataURL(compressed);
      } catch (error) {
        console.error("Image compression failed:", error);
        alert("⚠️ Failed to compress image. Try a smaller file.");
      }
    }
  };

  // 💾 Save profile
  const handleSave = () => {
    const updatedUser = { ...user, ...editData };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));

    // Update student list
    const students = JSON.parse(localStorage.getItem("students") || "[]");
    const updatedStudents = students.map((s) =>
      s.email === user.email ? { ...s, ...editData } : s
    );
    localStorage.setItem("students", JSON.stringify(updatedStudents));

    alert("✅ Profile updated successfully!");
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>🎓 Student Profile</h1>

      <div className={styles.card}>
        {/* Profile Picture */}
        <div className={styles.profileSection}>
          <strong>Profile Picture:</strong>
          <br />
          {editData.profilePic ? (
            <img
              src={editData.profilePic}
              alt="Profile"
              className={styles.profilePic}
            />
          ) : (
            <div className={styles.placeholderPic}>No Image</div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleProfilePicChange}
            className={styles.fileInput}
          />
        </div>

        {/* Editable Fields */}
        <div className={styles.formSection}>
          <div className={styles.inputGroup}>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={editData.name}
              onChange={handleChange}
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={editData.email}
              onChange={handleChange}
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Standard:</label>
            <input
              type="number"
              name="standard"
              value={editData.standard}
              onChange={handleChange}
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Contact Number:</label>
            <input
              type="text"
              name="contact"
              value={editData.contact}
              onChange={handleChange}
              className={styles.input}
            />
          </div>

          <div className={styles.statsSection}>
            <div className={styles.statBox}>
              <strong>📈 Progress:</strong> {progress}%
            </div>
            <div className={styles.statBox}>
              <strong>🏅 Certificates:</strong> {certificates.length}
            </div>
          </div>

          <button className={styles.saveBtn} onClick={handleSave}>
            💾 Save Changes
          </button>
        </div>
      </div>

      {/* Certificates Section */}
      <div className={styles.certificatesSection}>
        <h2>🏆 Your Certificates</h2>
        {certificates.length > 0 ? (
          <div className={styles.certGrid}>
            {certificates.map((cert, index) => (
              <div key={index} className={styles.certCard}>
                <p>📜 {cert.title}</p>
                <small>Issued on: {cert.date || "N/A"}</small>
              </div>
            ))}
          </div>
        ) : (
          <p className={styles.noData}>No certificates earned yet.</p>
        )}
      </div>

      <button className={styles.backBtn} onClick={handleBack}>
        ⬅ Back to Dashboard
      </button>
    </div>
  );
}
