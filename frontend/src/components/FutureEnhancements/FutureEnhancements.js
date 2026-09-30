import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./FutureEnhancements.module.css";

const enhancements = [
  {
    phase: "Phase 1",
    phaseLabel: "Coming Soon",
    color: "#1976d2",
    bg: "#e3f2fd",
    icon: "🚀",
    items: [
      {
        title: "AI-Powered Quiz Generator",
        desc: "Admin can generate quizzes automatically using AI based on subject and standard. No manual question entry needed.",
        icon: "🤖",
        status: "planned",
        tags: ["AI", "Quiz", "Admin"],
      },
      {
        title: "Live Class Integration",
        desc: "Students can join live video classes with teachers directly from the dashboard using WebRTC technology.",
        icon: "📹",
        status: "planned",
        tags: ["Live", "Video", "Teacher"],
      },
      {
        title: "Parent Dashboard",
        desc: "Parents can monitor their child's progress, quiz scores, certificates, and attendance in real-time.",
        icon: "👨‍👩‍👧",
        status: "planned",
        tags: ["Parent", "Progress", "Monitor"],
      },
      {
        title: "Mobile App (Android & iOS)",
        desc: "Fun2Learn mobile app for students to learn on-the-go with offline support for books and videos.",
        icon: "📱",
        status: "planned",
        tags: ["Mobile", "Android", "iOS"],
      },
    ],
  },
  {
    phase: "Phase 2",
    phaseLabel: "In Development",
    color: "#2e7d32",
    bg: "#e8f5e9",
    icon: "⚙️",
    items: [
      {
        title: "Gamification & Leaderboard",
        desc: "Students earn points, badges, and ranks. Weekly leaderboard to motivate healthy competition among students.",
        icon: "🏅",
        status: "development",
        tags: ["Gamification", "Leaderboard", "Badges"],
      },
      {
        title: "Multi-Language Support",
        desc: "Platform available in Hindi, Gujarati, Marathi, and other regional languages for better accessibility.",
        icon: "🌐",
        status: "development",
        tags: ["Language", "Hindi", "Regional"],
      },
      {
        title: "Adaptive Learning Path",
        desc: "AI analyzes student performance and creates personalized learning paths with recommended books and videos.",
        icon: "🧠",
        status: "development",
        tags: ["AI", "Personalized", "Learning"],
      },
      {
        title: "Discussion Forum",
        desc: "Students and teachers can post questions, share answers, and collaborate in subject-wise discussion boards.",
        icon: "💬",
        status: "development",
        tags: ["Forum", "Community", "Discussion"],
      },
    ],
  },
  {
    phase: "Phase 3",
    phaseLabel: "Future Vision",
    color: "#6a1b9a",
    bg: "#f3e5f5",
    icon: "🌟",
    items: [
      {
        title: "AR/VR Learning Experience",
        desc: "Augmented and Virtual Reality modules for science experiments, history tours, and interactive 3D learning.",
        icon: "🥽",
        status: "vision",
        tags: ["AR", "VR", "Immersive"],
      },
      {
        title: "Smart Attendance System",
        desc: "Face recognition based attendance for online classes with automated reports sent to parents and admin.",
        icon: "📸",
        status: "vision",
        tags: ["AI", "Attendance", "Face Recognition"],
      },
      {
        title: "Offline Learning Mode",
        desc: "Download courses, books, and videos for offline access. Sync progress when back online.",
        icon: "📥",
        status: "vision",
        tags: ["Offline", "Download", "Sync"],
      },
      {
        title: "National Olympiad Integration",
        desc: "Students can participate in national-level olympiads directly from the platform with auto-registration.",
        icon: "🏆",
        status: "vision",
        tags: ["Olympiad", "Competition", "National"],
      },
    ],
  },
];

const statusConfig = {
  planned:     { label: "Planned",     color: "#1976d2", bg: "#e3f2fd" },
  development: { label: "In Progress", color: "#f57c00", bg: "#fff3e0" },
  vision:      { label: "Vision",      color: "#6a1b9a", bg: "#f3e5f5" },
};

export default function FutureEnhancements() {
  const navigate = useNavigate();
  const [activePhase, setActivePhase] = useState(null);
  const [selectedTag, setSelectedTag] = useState("All");

  const allTags = ["All", ...new Set(enhancements.flatMap(p => p.items.flatMap(i => i.tags)))];

  const filteredEnhancements = enhancements.map(phase => ({
    ...phase,
    items: phase.items.filter(item =>
      selectedTag === "All" || item.tags.includes(selectedTag)
    ),
  })).filter(phase => phase.items.length > 0);

  return (
    <div className={styles.wrapper}>
      {/* Header */}
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>← Back</button>
        <div className={styles.headerText}>
          <h1>🚀 Future Enhancements</h1>
          <p>Exciting features coming to Fun2Learn platform</p>
        </div>
      </div>

      {/* Stats Banner */}
      <div className={styles.statsBanner}>
        {[
          { icon: "💡", value: "12+", label: "Planned Features" },
          { icon: "⚙️", value: "3", label: "Development Phases" },
          { icon: "🎯", value: "2026", label: "Target Year" },
          { icon: "👨‍🎓", value: "10K+", label: "Students to Benefit" },
        ].map((s, i) => (
          <motion.div
            key={i}
            className={styles.statCard}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <span className={styles.statIcon}>{s.icon}</span>
            <span className={styles.statValue}>{s.value}</span>
            <span className={styles.statLabel}>{s.label}</span>
          </motion.div>
        ))}
      </div>

      {/* Tag Filter */}
      <div className={styles.tagFilter}>
        {allTags.map(tag => (
          <button
            key={tag}
            className={`${styles.tagBtn} ${selectedTag === tag ? styles.tagActive : ""}`}
            onClick={() => setSelectedTag(tag)}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Phases */}
      {filteredEnhancements.map((phase, pIdx) => (
        <motion.div
          key={pIdx}
          className={styles.phaseSection}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: pIdx * 0.15 }}
        >
          {/* Phase Header */}
          <div
            className={styles.phaseHeader}
            style={{ background: phase.color }}
            onClick={() => setActivePhase(activePhase === pIdx ? null : pIdx)}
          >
            <div className={styles.phaseLeft}>
              <span className={styles.phaseIcon}>{phase.icon}</span>
              <div>
                <h2>{phase.phase}</h2>
                <span className={styles.phaseLabel}>{phase.phaseLabel}</span>
              </div>
            </div>
            <div className={styles.phaseRight}>
              <span className={styles.phaseCount}>{phase.items.length} features</span>
              <span className={styles.phaseArrow}>{activePhase === pIdx ? "▲" : "▼"}</span>
            </div>
          </div>

          {/* Feature Cards */}
          <AnimatePresence>
            {activePhase !== pIdx && (
              <motion.div
                className={styles.cardsGrid}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                {phase.items.map((item, iIdx) => (
                  <motion.div
                    key={iIdx}
                    className={styles.featureCard}
                    style={{ borderLeft: `5px solid ${phase.color}`, background: phase.bg }}
                    whileHover={{ scale: 1.02, boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: iIdx * 0.08 }}
                  >
                    <div className={styles.cardTop}>
                      <span className={styles.featureIcon}>{item.icon}</span>
                      <span
                        className={styles.statusBadge}
                        style={{
                          background: statusConfig[item.status].bg,
                          color: statusConfig[item.status].color,
                        }}
                      >
                        {statusConfig[item.status].label}
                      </span>
                    </div>
                    <h3 className={styles.featureTitle} style={{ color: phase.color }}>
                      {item.title}
                    </h3>
                    <p className={styles.featureDesc}>{item.desc}</p>
                    <div className={styles.tagRow}>
                      {item.tags.map(tag => (
                        <span
                          key={tag}
                          className={styles.tag}
                          style={{ background: phase.color + "22", color: phase.color }}
                          onClick={() => setSelectedTag(tag)}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}

      {/* Roadmap Timeline */}
      <div className={styles.timeline}>
        <h2 className={styles.timelineTitle}>📅 Development Roadmap</h2>
        <div className={styles.timelineTrack}>
          {[
            { year: "Q1 2026", label: "Phase 1 Launch", color: "#1976d2", done: false },
            { year: "Q2 2026", label: "Mobile App Beta", color: "#2e7d32", done: false },
            { year: "Q3 2026", label: "Phase 2 Features", color: "#f57c00", done: false },
            { year: "Q4 2026", label: "AR/VR Pilot", color: "#6a1b9a", done: false },
            { year: "2027",    label: "Full Platform v2.0", color: "#c62828", done: false },
          ].map((t, i) => (
            <div key={i} className={styles.timelineItem}>
              <div className={styles.timelineDot} style={{ background: t.color }}></div>
              <div className={styles.timelineContent}>
                <span className={styles.timelineYear} style={{ color: t.color }}>{t.year}</span>
                <span className={styles.timelineLabel}>{t.label}</span>
              </div>
              {i < 4 && <div className={styles.timelineLine}></div>}
            </div>
          ))}
        </div>
      </div>

      {/* Suggestion Box */}
      <div className={styles.suggestionBox}>
        <h3>💡 Have a Feature Suggestion?</h3>
        <p>We love hearing from our students and teachers. Share your ideas to make Fun2Learn even better!</p>
        <div className={styles.suggestionForm}>
          <input type="text" placeholder="Your name" className={styles.suggInput} />
          <input type="text" placeholder="Feature idea..." className={styles.suggInput} />
          <button
            className={styles.suggBtn}
            onClick={() => alert("Thank you for your suggestion! 🎉 We will review it soon.")}
          >
            Submit Idea 🚀
          </button>
        </div>
      </div>
    </div>
  );
}
