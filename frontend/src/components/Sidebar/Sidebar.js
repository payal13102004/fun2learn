import React from "react";
import styles from "./Sidebar.module.css";
import { FaBook, FaUser, FaCertificate, FaChartBar, FaListAlt, FaPuzzlePiece } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const adminLinks = [
  { label: "Manage Courses", icon: <FaBook /> },
  { label: "Manage Lessons", icon: <FaListAlt /> },
  { label: "Add Quizzes", icon: <FaPuzzlePiece /> },
  { label: "User Management", icon: <FaUser /> },
  { label: "Certificates", icon: <FaCertificate /> },
  { label: "Reports", icon: <FaChartBar /> },
];

export default function Sidebar({ userType }) {
  const navigate = useNavigate();
  return (
    <nav className={styles.sidebar}>
      <h1 className={styles.logo}>Fun2Learn</h1>
      <ul>
        {userType === "admin" &&
          adminLinks.map((item, i) => (
            <li key={item.label} className={styles.navItem}>
              {item.icon} <span>{item.label}</span>
            </li>
          ))}
      </ul>
      <button className={styles.logoutBtn} onClick={() => navigate("/")}>
        Logout
      </button>
    </nav>
  );
}