import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaSignInAlt,
  FaSignOutAlt,
  FaPuzzlePiece,
  FaRocket,
  FaBookOpen,
  FaUserFriends,
  FaStar,
  FaSmile,
  FaGamepad,
  FaTrophy,
} from "react-icons/fa";
import "./HomePage.css";
import kidsImg from "../assets/illustrations/kids.webp";

const subjects = [
  { title: "Math Quest", icon: <FaPuzzlePiece />, color: "#ffb347" },
  { title: "Science Safari", icon: <FaRocket />, color: "#69e3ff" },
  { title: "Reading Realm", icon: <FaBookOpen />, color: "#ffd966" },
  { title: "Social Stars", icon: <FaUserFriends />, color: "#b3e283" },
];

const features = [
  {
    icon: <FaGamepad />,
    title: "Games & Play",
    desc: "Learn through interactive games and challenges!",
    color: "#f7b32b",
  },
  {
    icon: <FaTrophy />,
    title: "Badges & Rewards",
    desc: "Earn badges and certificates for your achievements.",
    color: "#69f0ae",
  },
  {
    icon: <FaSmile />,
    title: "Kid-Friendly",
    desc: "Safe, colorful, and made just for kids!",
    color: "#4fc3f7",
  },
];

const howItWorks = [
  { step: "1", label: "Sign Up", detail: "Fast & easy!" },
  { step: "2", label: "Pick a Subject", detail: "Choose what you love" },
  { step: "3", label: "Learn & Play", detail: "Watch, play, quiz & win!" },
  { step: "4", label: "Earn Rewards", detail: "Collect badges & certificates" },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  // ✅ Always start logged out
  useEffect(() => {
    setIsLoggedIn(false);
    setUserName("");
  }, []);

  // ✅ Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <div className="f2l-home-bg">
      {/* Decorative Shape */}
      <motion.div
        className="f2l-home-shape"
        initial={{ scale: 0.6, y: -60, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ duration: 1.2, type: "spring" }}
      ></motion.div>

      {/* NAVBAR */}
      <motion.nav
        className="f2l-home-navbar"
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", delay: 0.2 }}
      >
        <div className="f2l-home-logo">🌟 Fun2Learn</div>

        <div className="f2l-home-navlinks">
          <motion.a href="#subjects" whileHover={{ scale: 1.08 }}>
            Subjects
          </motion.a>
          <motion.a href="#howitworks" whileHover={{ scale: 1.08 }}>
            How it Works
          </motion.a>
          <motion.a href="#features" whileHover={{ scale: 1.08 }}>
            Features
          </motion.a>
        </div>

        {/* 🔐 Login / Logout Button */}
        {isLoggedIn ? (
          <div className="f2l-user-actions">
            <span className="f2l-user-name">👋 {userName}</span>
            <motion.button
              className="f2l-home-login-btn"
              whileHover={{
                scale: 1.09,
                backgroundColor: "#e57373",
                color: "#fff",
              }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
            >
              <FaSignOutAlt style={{ marginRight: 7 }} /> Logout
            </motion.button>
          </div>
        ) : (
          <motion.button
            className="f2l-home-login-btn"
            whileHover={{
              scale: 1.09,
              backgroundColor: "#f7b32b",
              color: "#fff",
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/login")}
          >
            <FaSignInAlt style={{ marginRight: 7 }} /> Login
          </motion.button>
        )}
      </motion.nav>

      {/* HERO SECTION */}
      <section className="f2l-home-hero">
        <motion.div
          className="f2l-home-hero-left"
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3, type: "spring" }}
        >
          <motion.h1
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.7 }}
          >
            <span className="f2l-highlight">Unlock</span> a World of <br />
            <span style={{ color: "#f7b32b" }}>Fun Learning!</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            Dive into interactive games, videos, and quizzes.
            <br />
            <span style={{ color: "#4fc3f7" }}>
              Start your adventure today!
            </span>
          </motion.p>
          <motion.button
            className="f2l-home-join-btn"
            whileHover={{
              scale: 1.11,
              backgroundColor: "#4fc3f7",
              color: "#fff",
            }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300 }}
            onClick={() => navigate("/register")}
          >
            Join Now
          </motion.button>
        </motion.div>

        <motion.div
          className="f2l-home-hero-right"
          initial={{ opacity: 0, x: 70 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.7, type: "spring" }}
        >
          <motion.img
            src={kidsImg}
            alt="Happy Kid Astronaut"
            className="f2l-home-hero-img"
            animate={{
              y: [0, -18, 0],
              scale: [1, 1.04, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
            }}
          />
          {/* Animated floating stars */}
          <div className="f2l-floating-stars">
            <motion.div
              style={{ position: "absolute", top: 20, left: 60 }}
              animate={{
                y: [0, -12, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                repeatType: "reverse",
                delay: 0.3,
              }}
            >
              <FaStar style={{ color: "#f7b32b", fontSize: 32 }} />
            </motion.div>
            <motion.div
              style={{ position: "absolute", top: 50, left: 140 }}
              animate={{
                y: [0, -14, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2.1,
                repeat: Infinity,
                repeatType: "reverse",
                delay: 0.7,
              }}
            >
              <FaStar style={{ color: "#69e3ff", fontSize: 26 }} />
            </motion.div>
            <motion.div
              style={{ position: "absolute", top: 100, left: 30 }}
              animate={{
                y: [0, -10, 0],
                scale: [1, 1.15, 1],
              }}
              transition={{
                duration: 2.8,
                repeat: Infinity,
                repeatType: "reverse",
                delay: 0.1,
              }}
            >
              <FaStar style={{ color: "#ffd966", fontSize: 28 }} />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* SUBJECTS */}
      <motion.section
        className="f2l-home-section"
        id="subjects"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h2>Explore Subjects</h2>
        <div className="f2l-home-subjects">
          {subjects.map((s, i) => (
            <motion.div
              key={i}
              className="f2l-home-subject-card"
              style={{ background: s.color }}
              whileHover={{
                y: -14,
                rotate: -4 + i * 2,
                boxShadow: "0 10px 32px #23c9ff44",
                scale: 1.04,
              }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <span className="f2l-home-subject-icon">{s.icon}</span>
              <span className="f2l-home-subject-title">{s.title}</span>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* HOW IT WORKS */}
      <motion.section
        className="f2l-home-section"
        id="howitworks"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9 }}
      >
        <h2>How It Works</h2>
        <div className="f2l-home-howitworks">
          {howItWorks.map((step, idx) => (
            <motion.div
              key={idx}
              className="f2l-hiw-step"
              initial={{ scale: 0.7, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ delay: idx * 0.15, duration: 0.5, type: "spring" }}
              viewport={{ once: true }}
            >
              <div className="f2l-hiw-circle">{step.step}</div>
              <div>
                {step.label}
                <br />
                <small>{step.detail}</small>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* FEATURES */}
      <motion.section
        className="f2l-home-section"
        id="features"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <h2>Why Kids Love Fun2Learn?</h2>
        <div className="f2l-home-feature-list">
          {features.map((f, i) => (
            <motion.div
              key={i}
              className="f2l-home-feature-card"
              whileHover={{
                scale: 1.07,
                rotate: -2 + i * 2,
                backgroundColor: f.color,
                color: "#fff",
              }}
              transition={{ type: "spring" }}
            >
              <span className="feature-icon">{f.icon}</span>
              <h4>{f.title}</h4>
              <p>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* FOOTER */}
      <footer className="f2l-home-footer">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          © {new Date().getFullYear()} Fun2Learn |{" "}
          <a href="#features">Features</a>
        </motion.div>
      </footer>
    </div>
  );
}
