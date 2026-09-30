// src/components/Settings/Settings.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Settings.module.css";
import { motion } from "framer-motion";

export default function Settings() {
  const navigate = useNavigate();
  const [student, setStudent] = useState({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilePic, setProfilePic] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setStudent(user);
    setName(user.name || "");
    setEmail(user.email || "");
    setProfilePic(user.profilePic || "");
  }, []);

  const handleSave = () => {
    const students = JSON.parse(localStorage.getItem("students") || "[]");
    const updatedStudents = students.map((s) =>
      s.email === student.email
        ? { ...s, name, email, password: password || s.password, profilePic }
        : s
    );
    localStorage.setItem("students", JSON.stringify(updatedStudents));
    localStorage.setItem(
      "user",
      JSON.stringify({ ...student, name, email, password: password || student.password, profilePic })
    );
    alert("Profile updated successfully!");
    navigate("/student-dashboard"); // Redirect after save
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setProfilePic(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <motion.div
      className={styles.wrapper}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <button className={styles.backBtn} onClick={() => navigate(-1)}>← Back</button>
      <h2>Settings</h2>
      <div className={styles.form}>
        <label>Profile Picture:</label>
        <input type="file" accept="image/*" onChange={handleProfilePicChange} />
        {profilePic && <img src={profilePic} alt="Profile" className={styles.profilePreview} />}

        <label>Name:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />

        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

       
        <button className={styles.saveBtn} onClick={handleSave}>
          Save Changes
        </button>
      </div>
    </motion.div>
  );
}
