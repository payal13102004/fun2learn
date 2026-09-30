import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaBook } from "react-icons/fa";
import styles from "./RegisterPage.module.css";

function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [standard, setStandard] = useState(5); // Default standard
  const [msg, setMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setMsg("");

    // Password validation
    if (!/[A-Z]/.test(password)) {
      setMsg("Password must contain at least one capital letter 🔤");
      return;
    }

    if (password !== confirm) {
      setMsg("Passwords do not match ❌");
      return;
    }

    try {
      // ✅ Call backend API
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, standard }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMsg(data.message || "Registration failed ❌");
        return;
      }

      // ✅ Save to localStorage for frontend use
      const studentObj = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        standard: data.user.standard,
        role: "student",
        courses: [],
        certificates: [],
        progress: {},
        createdAt: new Date().toISOString(),
      };

      // Save in students array
      const students = JSON.parse(localStorage.getItem("students") || "[]");
      const exists = students.some((s) => s.email === email);
      if (!exists) {
        localStorage.setItem("students", JSON.stringify([...students, studentObj]));
      }

      // Save as current user
      localStorage.setItem("user", JSON.stringify(studentObj));
      localStorage.setItem("token", data.token);

      setSuccess(true);
      setTimeout(() => navigate("/student-dashboard"), 1500);

    } catch (err) {
      console.error("Register error:", err);
      setMsg("Server error. Please try again. ❌");
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h2>Create Account ✨</h2>

        {success ? (
          <div className={styles.success}>
            <span role="img" aria-label="success" style={{ fontSize: 50 }}>
              🎉
            </span>
            <p>Registration Successful! Redirecting...</p>
          </div>
        ) : (
          <form onSubmit={handleRegister}>
            {/* Full Name */}
            <div className={styles.inputGroup}>
              <FaUser className={styles.iconInput} />
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Email */}
            <div className={styles.inputGroup}>
              <FaEnvelope className={styles.iconInput} />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div className={styles.inputGroup}>
              <FaLock className={styles.iconInput} />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Confirm Password */}
            <div className={styles.inputGroup}>
              <FaLock className={styles.iconInput} />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
            </div>

            {/* Standard */}
            <div className={styles.inputGroup}>
              <FaBook className={styles.iconInput} />
              <select
                value={standard}
                onChange={(e) => setStandard(parseInt(e.target.value))}
                required
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((s) => (
                  <option key={s} value={s}>
                    Standard {s}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" className={styles.registerBtn}>
              Register
            </button>
          </form>
        )}

        {msg && <p className={styles.errorMsg}>{msg}</p>}

        <p className={styles.note}>
          Already have an account?{" "}
          <Link to="/" className={styles.loginLink}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
