import React, { useEffect, useState } from "react";
import styles from "./Videos.module.css";
import { FaVideo, FaTimes, FaPlay } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// Direct YouTube video links - will embed using youtube-nocookie
const defaultVideos = [
  {
    id: 1,
    title: "Mathematics Basics - Addition & Subtraction",
    subject: "Math",
    std: "General",
    link: "https://youtu.be/AuX7nPBqDts",
    thumbnail: "https://img.youtube.com/vi/AuX7nPBqDts/hqdefault.jpg",
    description: "Learn basic mathematics concepts",
  },
  {
    id: 2,
    title: "Science Fundamentals - Solar System",
    subject: "Science",
    std: "General",
    link: "https://youtu.be/Rd4a1X3B61w",
    thumbnail: "https://img.youtube.com/vi/Rd4a1X3B61w/hqdefault.jpg",
    description: "Explore science fundamentals",
  },
  {
    id: 3,
    title: "English Grammar - Parts of Speech",
    subject: "English",
    std: "General",
    link: "https://youtu.be/0l69KEx7GQo",
    thumbnail: "https://img.youtube.com/vi/0l69KEx7GQo/hqdefault.jpg",
    description: "Master English grammar basics",
  },
  {
    id: 4,
    title: "EVS - Our Environment & Nature",
    subject: "EVS",
    std: "General",
    link: "https://youtu.be/Q34TCe-yFmo",
    thumbnail: "https://img.youtube.com/vi/Q34TCe-yFmo/hqdefault.jpg",
    description: "Learn about our environment",
  },
  {
    id: 5,
    title: "History - Indus Valley Civilization",
    subject: "History",
    std: "General",
    link: "https://youtu.be/n7ndRwqJYDM",
    thumbnail: "https://img.youtube.com/vi/n7ndRwqJYDM/hqdefault.jpg",
    description: "Crash Course: Indus Valley Civilization",
  },
];

// Subject color themes
const subjectThemes = {
  Math:    { color: "#1565c0", bg: "#e3f2fd", icon: "🔢" },
  Science: { color: "#2e7d32", bg: "#e8f5e9", icon: "🔬" },
  English: { color: "#e65100", bg: "#fff3e0", icon: "📖" },
  EVS:     { color: "#00695c", bg: "#e0f2f1", icon: "🌿" },
  History: { color: "#6a1b9a", bg: "#f3e5f5", icon: "🏛️" },
  default: { color: "#1976d2", bg: "#e3f2fd", icon: "🎥" },
};

export default function Videos() {
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [watched, setWatched] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const students = JSON.parse(localStorage.getItem("students") || "[]");
    const currentStudent = students.find((s) => s.email === user.email);
    const studentStd = currentStudent?.std || currentStudent?.standard || "General";

    const adminVideos = JSON.parse(localStorage.getItem("videos") || "[]");
    const filteredVideos = adminVideos.filter(
      (v) => !v.std || v.std === studentStd || v.std === "General"
    );

    setVideos(filteredVideos.length > 0 ? filteredVideos : defaultVideos);
    if (currentStudent?.watchedVideos) setWatched(currentStudent.watchedVideos);
  }, []);

  const handleWatch = (video) => {
    setActiveVideo(video);

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    let students = JSON.parse(localStorage.getItem("students") || "[]");
    const idx = students.findIndex((s) => s.email === user.email);

    if (idx !== -1) {
      if (!students[idx].watchedVideos) students[idx].watchedVideos = [];
      if (!students[idx].watchedVideos.includes(video.id))
        students[idx].watchedVideos.push(video.id);
      students[idx].videosWatched = students[idx].watchedVideos.length;
      localStorage.setItem("students", JSON.stringify(students));
      setWatched([...students[idx].watchedVideos]);
      window.dispatchEvent(new Event("storage"));
    }
  };

  const handleClose = () => setActiveVideo(null);

  // Check if link is YouTube
  const getYoutubeId = (video) => {
    const link = video.link || "";
    const match = link.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    return match ? match[1] : null;
  };

  const getEmbedUrl = (video) => {
    if (video.embedUrl) return video.embedUrl;
    const ytId = getYoutubeId(video);
    if (ytId) return `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1`;
    return null;
  };

  return (
    <div className={styles.wrapper}>
      <button className={styles.backBtn} onClick={() => navigate(-1)}>
        ← Back
      </button>
      <h2>🎥 My Learning Videos</h2>

      {videos.length === 0 ? (
        <p className={styles.noData}>No videos available for your standard yet.</p>
      ) : (
        <div className={styles.grid}>
          {videos.map((video) => {
            const isWatched = watched.includes(video.id);
            const theme = subjectThemes[video.subject] || subjectThemes.default;

            return (
              <motion.div
                key={video.id}
                className={`${styles.card} ${isWatched ? styles.watchedCard : ""}`}
                style={{ borderTop: `4px solid ${theme.color}` }}
                whileHover={{ scale: 1.04 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                {/* Thumbnail */}
                <div
                  className={styles.thumbnailWrapper}
                  style={{ background: theme.bg }}
                  onClick={() => handleWatch(video)}
                >
                  {video.thumbnail ? (
                    <img src={video.thumbnail} alt={video.title} className={styles.thumbnail} loading="lazy" />
                  ) : (
                    <FaVideo className={styles.icon} style={{ color: theme.color }} />
                  )}
                  <div className={styles.playOverlay} style={{ background: theme.color }}>
                    <FaPlay />
                  </div>
                  <div className={styles.subjectBadge} style={{ background: theme.color }}>
                    {theme.icon} {video.subject}
                  </div>
                </div>

                <div className={styles.cardBody}>
                  <h4>{video.title}</h4>
                  {video.description && <p className={styles.desc}>{video.description}</p>}
                  <small>Std: {video.std || "General"}</small>
                </div>

                <button
                  className={`${styles.viewBtn} ${isWatched ? styles.doneBtn : ""}`}
                  style={!isWatched ? { background: theme.color } : {}}
                  onClick={() => handleWatch(video)}
                >
                  {isWatched ? "✅ Watch Again" : "▶ Watch Video"}
                </button>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* ── Video Player Modal ── */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          >
            <motion.div
              className={styles.modalBox}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div
                className={styles.modalHeader}
                style={{ background: (subjectThemes[activeVideo.subject] || subjectThemes.default).color }}
              >
                <div className={styles.modalTitle}>
                  <span>{(subjectThemes[activeVideo.subject] || subjectThemes.default).icon}</span>
                  <h3>{activeVideo.title}</h3>
                </div>
                <button className={styles.closeBtn} onClick={handleClose}>
                  <FaTimes />
                </button>
              </div>

              {/* Video Player */}
              <div className={styles.videoContainer}>
                {getEmbedUrl(activeVideo) ? (
                  <div style={{ position: "relative", width: "100%", height: "100%" }}>
                    <iframe
                      width="100%"
                      height="100%"
                      src={getEmbedUrl(activeVideo)}
                      title={activeVideo.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      onError={() => {}}
                    />
                    {/* Fallback overlay - always visible as backup */}
                    <div className={styles.ytFallback}>
                      <p>Video not loading in embed?</p>
                      <a
                        href={activeVideo.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.ytOpenBtn}
                      >
                        ▶ Open on YouTube
                      </a>
                    </div>
                  </div>
                ) : activeVideo.link ? (
                  <video controls autoPlay className={styles.videoPlayer} key={activeVideo.id}>
                    <source src={activeVideo.link} type="video/mp4" />
                  </video>
                ) : (
                  <div className={styles.noVideo}>
                    <FaVideo size={50} />
                    <p>Video not available</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className={styles.modalFooter}>
                <span>📚 Subject: <strong>{activeVideo.subject}</strong></span>
                <span>📋 Std: <strong>{activeVideo.std || "General"}</strong></span>
                {activeVideo.description && <span>ℹ️ {activeVideo.description}</span>}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
