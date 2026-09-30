import React from "react";
import styles from "./CourseDetailsPage.module.css";
import { FaVideo, FaBookOpen, FaGamepad } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const lessons = [
  { type: "video", title: "Introduction to Math" },
  { type: "text", title: "Number Fun" },
  { type: "game", title: "Shape Sorting Game" },
];

export default function CourseDetailsPage() {
  const navigate = useNavigate();
  return (
    <div className={styles.wrapper}>
      <motion.div className={styles.card} initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        <h2>Math 101</h2>
        <p>Learn the basics of math with videos, interactive games, and fun lessons!</p>
        <div className={styles.lessons}>
          {lessons.map((l, i) => (
            <div className={styles.lessonCard} key={l.title}>
              {l.type === "video" && <FaVideo className={styles.icon} />}
              {l.type === "text" && <FaBookOpen className={styles.icon} />}
              {l.type === "game" && <FaGamepad className={styles.icon} />}
              <span>{l.title}</span>
            </div>
          ))}
        </div>
        <button className={styles.quizBtn} onClick={() => navigate("/quiz/1")}>
          Take Quiz
        </button>
      </motion.div>
    </div>
  );
}