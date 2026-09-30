// src/components/Achievements.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Achievements.module.css";
import { FaTrophy, FaMedal } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function Achievements() {
  const navigate = useNavigate();
  const [certificates, setCertificates] = useState([]);
  const [studentName, setStudentName] = useState("");
  const [newlyEarned, setNewlyEarned] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [lastQuizScore, setLastQuizScore] = useState(null);

  // Default certificates for fallback
  const defaultCertificates = [
    { title: "Certificate in Math", date: "", subject: "Math", score: 0 },
    { title: "Certificate in Science", date: "", subject: "Science", score: 0 },
    { title: "Certificate in History", date: "", subject: "History", score: 0 },
  ];

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setStudentName(user.name || "Student");

    const students = JSON.parse(localStorage.getItem("students") || "[]");
    const currentStudent = students.find((s) => s.email === user.email);

    let certs = [];
    if (currentStudent && currentStudent.certificates) {
      certs = currentStudent.certificates.map((cert) => ({
        ...cert,
        date: cert.date || new Date().toLocaleDateString(),
        score: cert.score || 0,
      }));
      certs.sort((a, b) => new Date(b.date) - new Date(a.date));
      setCertificates(certs);

      // Show toast for newly earned certificate
      const latest = certs[0];
      setNewlyEarned(latest);
      setShowToast(true);
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    } else {
      setCertificates(defaultCertificates);
    }

    // Get last quiz score
    const score = localStorage.getItem("lastQuizScore");
    if (score) setLastQuizScore(score);
  }, []);

  // Subject colors for certificate styling
  const subjectColors = {
    Math: "#f7b32b",
    Science: "#6a4c93",
    History: "#f08a5d",
  };

  // Download certificate as PNG
  const handleDownload = (cert) => {
    const canvas = document.createElement("canvas");
    canvas.width = 900;
    canvas.height = 620;
    const ctx = canvas.getContext("2d");

    // Subject themes
    const themes = {
      Math:    { bg: "#dbeeff", accent: "#1565c0" },
      Science: { bg: "#dff5e1", accent: "#2e7d32" },
      English: { bg: "#fff3e0", accent: "#e65100" },
      History: { bg: "#fce4ec", accent: "#880e4f" },
    };
    const t = themes[cert.subject] || { bg: "#fff9e6", accent: "#f57f17" };

    // Background
    ctx.fillStyle = t.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Outer border
    ctx.strokeStyle = t.accent;
    ctx.lineWidth = 10;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

    // Inner border
    ctx.strokeStyle = t.accent;
    ctx.lineWidth = 3;
    ctx.setLineDash([10, 5]);
    ctx.strokeRect(25, 25, canvas.width - 50, canvas.height - 50);
    ctx.setLineDash([]);

    // Medal
    ctx.font = "60px Arial";
    ctx.textAlign = "center";
    ctx.fillText("🏅", canvas.width / 2, 110);

    // Title
    ctx.fillStyle = t.accent;
    ctx.font = "bold 38px Georgia";
    ctx.fillText("Certificate of Completion", canvas.width / 2, 175);

    // Divider line
    ctx.strokeStyle = t.accent;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(200, 195);
    ctx.lineTo(700, 195);
    ctx.stroke();

    // Presented to
    ctx.fillStyle = "#555";
    ctx.font = "italic 20px Arial";
    ctx.fillText("This certificate is proudly presented to", canvas.width / 2, 235);

    // Student Name
    ctx.fillStyle = t.accent;
    ctx.font = "bold 44px Georgia";
    ctx.fillText(studentName, canvas.width / 2, 295);

    // For completing
    ctx.fillStyle = "#555";
    ctx.font = "20px Arial";
    ctx.fillText("For successfully completing", canvas.width / 2, 340);

    // Subject
    ctx.fillStyle = t.accent;
    ctx.font = "bold 30px Georgia";
    ctx.fillText(cert.subject || cert.title, canvas.width / 2, 385);

    // Score boxes
    const boxY = 420;
    const boxes = [
      { label: "Score", value: `${cert.score || 0}%`, color: t.accent },
      { label: "Correct", value: cert.correctAnswers ?? "—", color: "#28a745" },
      { label: "Incorrect", value: cert.incorrectAnswers ?? "—", color: "#dc3545" },
    ];
    boxes.forEach((box, i) => {
      const x = 250 + i * 160;
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.roundRect(x - 55, boxY, 110, 70, 10);
      ctx.fill();
      ctx.strokeStyle = box.color;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = box.color;
      ctx.font = "bold 22px Arial";
      ctx.fillText(box.value, x, boxY + 32);
      ctx.fillStyle = "#777";
      ctx.font = "13px Arial";
      ctx.fillText(box.label, x, boxY + 55);
    });

    // Footer
    ctx.strokeStyle = t.accent;
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(50, 515);
    ctx.lineTo(850, 515);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = t.accent;
    ctx.font = "16px Arial";
    ctx.textAlign = "left";
    ctx.fillText(`Date: ${cert.date || new Date().toLocaleDateString()}`, 80, 550);
    ctx.textAlign = "right";
    ctx.font = "bold 20px Arial";
    ctx.fillText("Fun2Learn", 820, 550);

    // Corner stars
    ctx.font = "24px Arial";
    ctx.textAlign = "center";
    ctx.fillText("⭐", 60, 60);
    ctx.fillText("⭐", canvas.width - 60, 60);
    ctx.fillText("⭐", 60, canvas.height - 30);
    ctx.fillText("⭐", canvas.width - 60, canvas.height - 30);

    // Download
    const link = document.createElement("a");
    link.download = `${cert.subject || "certificate"}_Fun2Learn.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className={styles.wrapper}>
      <button className={styles.backBtn} onClick={() => navigate(-1)}>← Back</button>
      <h2>My Achievements</h2>

      {/* Last Quiz Score */}
      <div className={styles.quizScoreCard}>
        <FaMedal className={styles.scoreIcon} />
        {lastQuizScore ? (
          <>
            <h3>Last Quiz Score</h3>
            <p className={styles.scoreText}>
              {lastQuizScore}%{" "}
              {lastQuizScore >= 70 ? (
                <span className={styles.pass}>✅ Passed</span>
              ) : (
                <span className={styles.fail}>❌ Try Again</span>
              )}
            </p>
          </>
        ) : (
          <p>No quiz score yet. Take a quiz to get started!</p>
        )}
      </div>

      {/* Toast for new certificate */}
      <AnimatePresence>
        {showToast && newlyEarned && (
          <motion.div
            className={styles.toast}
            initial={{ opacity: 0, y: -50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 120 }}
          >
            🎉 New Certificate Unlocked: {newlyEarned.title}!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Certificates Grid */}
      <div className={styles.certificatesGrid}>
        {certificates.map((cert, idx) => (
          <motion.div
            key={idx}
            className={`${styles.certificateCard} ${
              newlyEarned === cert ? styles.newlyEarned : ""
            }`}
            style={{ borderTop: `5px solid ${subjectColors[cert.subject] || "#333"}` }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1, type: "spring", stiffness: 120 }}
            whileHover={{
              scale: 1.05,
              boxShadow: "0px 10px 20px rgba(0,0,0,0.2)",
            }}
          >
            <FaTrophy className={styles.trophyIcon} />
            <h3>{cert.title}</h3>
            <p>🎓 {studentName}</p>
            {cert.date && <small>Completed on: {cert.date}</small>}
            {cert.score !== undefined && <small>Score: {cert.score}%</small>}
            <div className={styles.cardButtons}>
              <button
                className={styles.viewBtn}
                onClick={() => navigate("/certificate", { state: { certificate: cert } })}
              >
                🏆 View Certificate
              </button>
              <button className={styles.downloadBtn} onClick={() => handleDownload(cert)}>
                📥 Download
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
