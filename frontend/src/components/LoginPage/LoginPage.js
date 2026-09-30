// components/LoginPage/LoginPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LoginPage.module.css";

const API_URL = "http://localhost:5000/api/auth/login";
const floatingItems = ["⭐", "🌈", "💡", "🎈", "🌟", "📚", "🎵", "✨"];

function getRandomStyle() {
  return {
    left: `${Math.random() * 100}%`,
    fontSize: `${1 + Math.random() * 2}rem`,
    animationDuration: `${10 + Math.random() * 15}s`,
    animationDelay: `${Math.random() * 10}s`,
    color: `hsl(${Math.floor(Math.random() * 360)}, 80%, 70%)`,
  };
}

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [shake, setShake] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMsg("");
    setShake(false);
    setLoading(true);

    // Password validation - must contain at least one capital letter (skip for admin)
    if (email !== "admin@fun2learn.com" && !/[A-Z]/.test(password)) {
      setMsg("Password must contain at least one capital letter");
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setMsg(data.message || "Login failed");
        setShake(true);
        setTimeout(() => setShake(false), 500);
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      onLogin?.();

      setIsSuccess(true);
      setLoading(false);

      setTimeout(() => {
        if (data.user.role === "admin") navigate("/admin-dashboard");
        else navigate("/student-dashboard");
      }, 1200);
    } catch {
      setMsg("Server error");
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      {/* Floating background animation */}
      <div className={styles.floatingBackground}>
        {Array.from({ length: 12 }).map((_, i) => (
          <span key={i} style={getRandomStyle()}>
            {floatingItems[Math.floor(Math.random() * floatingItems.length)]}
          </span>
        ))}
      </div>

      <div className={styles.card}>
        <h1>Fun2Learn</h1>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
          />

          {/* Forgot Password Link */}
          <div
            className={styles.forgotPassword}
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password?
          </div>

          <button
            type="submit"
            className={`${styles.loginBtn} ${isSuccess ? styles.success : ""} ${
              shake ? styles.shake : ""
            }`}
            disabled={isSuccess || loading}
          >
            {loading ? <div className={styles.spinner}></div> : "Login"}
          </button>
        </form>

        {/* Register Button */}
        <button
          onClick={() => navigate("/register")}
          className={styles.studentRegister}
        >
          Register
        </button>
        <div className={styles.note}>Only Students can Register</div>

        {/* Error Message */}
        {msg && <p className={styles.errorMsg}>{msg}</p>}
      </div>
    </div>
  );
}

export default LoginPage;
