import React, { useEffect, useState } from "react";
import styles from "./CertificatePage.module.css";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";

// Subject-based kid + planet + rocket decorations
const subjectThemes = {
  Math:     { kid: "👨‍🚀", planet: "🪐", rocket: "🚀", extra: "⭐" },
  Science:  { kid: "🧑‍🔬", planet: "🌍", rocket: "🔭", extra: "⚗️" },
  English:  { kid: "🧑‍💻", planet: "📖", rocket: "✏️", extra: "📚" },
  History:  { kid: "🧑‍🎓", planet: "🏛️", rocket: "📜", extra: "🗺️" },
  EVS:      { kid: "🧑‍🌾", planet: "🌿", rocket: "🌱", extra: "🌎" },
  default:  { kid: "🧒",   planet: "🪐", rocket: "🚀", extra: "⭐" },
};

export default function CertificatePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [studentName, setStudentName] = useState("");
  const [certificate, setCertificate] = useState({});
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setStudentName(user.name || "Student");

    const today = new Date();
    setCurrentDate(
      today.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" })
    );

    if (location.state?.certificate) {
      setCertificate(location.state.certificate);
    } else {
      const students = JSON.parse(localStorage.getItem("students") || "[]");
      const current = students.find((s) => s.email === user.email);
      if (current && current.certificates?.length > 0) {
        setCertificate(current.certificates[current.certificates.length - 1]);
      } else {
        setCertificate({ title: "No Certificates Earned Yet" });
      }
    }
  }, [location.state]);

  const theme = subjectThemes[certificate.subject] || subjectThemes.default;

  if (certificate.title === "No Certificates Earned Yet") {
    return (
      <div className={styles.wrapper}>
        <div className={styles.noCertificate}>
          <h3>No Certificates Available Yet 😔</h3>
          <p>Complete quizzes to earn your first achievement!</p>
          <button className={styles.goBackBtn} onClick={() => navigate(-1)}>Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <button className={styles.backBtn} onClick={() => navigate(-1)}>← Back</button>

      <motion.div
        className={styles.certCard}
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.8 }}
      >
        {/* Corner badges */}
        <div className={styles.cornerTL}>🔵</div>
        <div className={styles.cornerTR}>🔵</div>
        <div className={styles.cornerBL}>🔵</div>
        <div className={styles.cornerBR}>🔵</div>

        {/* Scattered stars */}
        <span className={`${styles.star} ${styles.star1}`}>⭐</span>
        <span className={`${styles.star} ${styles.star2}`}>✨</span>
        <span className={`${styles.star} ${styles.star3}`}>⭐</span>
        <span className={`${styles.star} ${styles.star4}`}>✨</span>
        <span className={`${styles.star} ${styles.star5}`}>⭐</span>
        <span className={`${styles.star} ${styles.star6}`}>💫</span>
        <span className={`${styles.star} ${styles.star7}`}>✨</span>
        <span className={`${styles.star} ${styles.star8}`}>⭐</span>

        {/* Planet - right side */}
        <div className={styles.planetDecor}>{theme.planet}</div>

        {/* Rocket - bottom right */}
        <div className={styles.rocketDecor}>{theme.rocket}</div>

        {/* Kid illustration - bottom left */}
        <div className={styles.kidDecor}>{theme.kid}</div>

        {/* Gold Medal */}
        <div className={styles.medalWrapper}>
          <div className={styles.medal}>
            <span className={styles.medalStar}>⭐</span>
          </div>
          <div className={styles.medalRibbon}></div>
        </div>

        {/* Title */}
        <h1 className={styles.certTitle}>Certificate of Completion</h1>

        {/* Presented to */}
        <p className={styles.presentedTo}>This certificate is proudly presented to</p>

        {/* Student Name */}
        <h2 className={styles.studentName}>{studentName}</h2>

        {/* Course */}
        <p className={styles.forCompleting}>For successfully completing</p>
        <h3 className={styles.courseName}>
          {certificate.subject || certificate.title}
        </h3>

        {/* Score Row */}
        {certificate.score !== undefined && (
          <div className={styles.scoreRow}>
            <div className={styles.scoreBox} style={{ borderColor: "#1565c0" }}>
              <span className={styles.scoreIcon}>💯</span>
              <span className={styles.scoreNum} style={{ color: "#1565c0" }}>{certificate.score}%</span>
              <span className={styles.scoreLabel}>Score</span>
            </div>
            <div className={styles.scoreBox} style={{ borderColor: "#28a745" }}>
              <span className={styles.scoreIcon}>✅</span>
              <span className={styles.scoreNum} style={{ color: "#28a745" }}>{certificate.correctAnswers ?? "—"}</span>
              <span className={styles.scoreLabel}>Correct</span>
            </div>
            <div className={styles.scoreBox} style={{ borderColor: "#dc3545" }}>
              <span className={styles.scoreIcon}>❌</span>
              <span className={styles.scoreNum} style={{ color: "#dc3545" }}>{certificate.incorrectAnswers ?? "—"}</span>
              <span className={styles.scoreLabel}>Incorrect</span>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className={styles.certFooter}>
          <p className={styles.certDate}>
            Date: {certificate.date || currentDate}
          </p>
          <p className={styles.branding}>Fun2Learn</p>
        </div>
      </motion.div>

      {/* Buttons */}
      <div className={styles.actionButtons}>
        <button className={styles.downloadBtn} onClick={() => window.print()}>
          📥 Download Certificate
        </button>
        <button className={styles.printBtn} onClick={() => window.print()}>
          🖨️ Print Certificate
        </button>
      </div>
    </div>
  );
}
