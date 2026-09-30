import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaMoon, FaSun, FaLock, FaUser, FaEnvelope } from "react-icons/fa";
import "./Settings.css";

export default function Settings() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Admin");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [profilePic, setProfilePic] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Load saved settings
  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("adminSettings"));
    if (savedData) {
      setUsername(savedData.username || "");
      setEmail(savedData.email || "");
      setRole(savedData.role || "Admin");
      setEmailNotifications(savedData.emailNotifications || false);
      setTwoFactorAuth(savedData.twoFactorAuth || false);
      setProfilePic(savedData.profilePic || "");
      setDarkMode(savedData.darkMode || false);
    }
  }, []);

  // Handle profile picture upload
  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setProfilePic(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Save settings
  const handleSave = () => {
    if (password && password !== confirmPassword) {
      alert("❌ Passwords do not match!");
      return;
    }

    const settings = {
      username,
      email,
      role,
      emailNotifications,
      twoFactorAuth,
      profilePic,
      darkMode,
    };

    localStorage.setItem("adminSettings", JSON.stringify(settings));
    alert("✅ Settings saved successfully!");
    navigate("/admin-dashboard");
  };

  // Go back
  const handleBack = () => navigate("/admin-dashboard");

  // Logout admin
  const handleLogout = () => {
    localStorage.removeItem("adminSettings");
    localStorage.removeItem("adminLogin");
    localStorage.removeItem("token");
    alert("👋 Logged out successfully!");
    navigate("/admin-login");
  };

  // Toggle theme
  const toggleTheme = () => setDarkMode(!darkMode);

  return (
    <div className={`settings-container ${darkMode ? "dark-mode" : ""}`}>
      <div className="settings-header">
        <h2 className="settings-title">⚙️ Admin Settings</h2>
        <button className="theme-toggle" onClick={toggleTheme}>
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
      </div>

      {/* Profile Section */}
      <div className="profile-section">
        <img
          src={profilePic || "https://via.placeholder.com/100"}
          alt="Profile"
          className="profile-pic"
        />
        <label className="upload-btn">
          Change Picture
          <input type="file" accept="image/*" onChange={handleProfilePicChange} hidden />
        </label>
      </div>

      {/* Profile Info */}
      <div className="settings-section">
        <h3 className="section-title">Profile Info</h3>
        <div className="form-group">
          <label><FaUser /> Username</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>

        <div className="form-group">
          <label><FaEnvelope /> Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Role</label>
          <input type="text" value={role} onChange={(e) => setRole(e.target.value)} disabled />
        </div>
      </div>

      {/* Notifications */}
      <div className="settings-section">
        <h3 className="section-title">Notifications</h3>
        <div className="checkbox-group">
          <input
            type="checkbox"
            id="emailNotifications"
            checked={emailNotifications}
            onChange={(e) => setEmailNotifications(e.target.checked)}
          />
          <label htmlFor="emailNotifications">Enable Email Notifications</label>
        </div>
      </div>

      {/* Security */}
      <div className="settings-section">
        <h3 className="section-title">Security</h3>
        <div className="checkbox-group">
          <input
            type="checkbox"
            id="twoFactorAuth"
            checked={twoFactorAuth}
            onChange={(e) => setTwoFactorAuth(e.target.checked)}
          />
          <label htmlFor="twoFactorAuth">Enable Two-Factor Authentication</label>
        </div>

        <div className="form-group">
          <label><FaLock /> New Password</label>
          <input
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="btn-group">
        <button className="back-btn" onClick={handleBack}>← Back</button>
        <button className="save-btn" onClick={handleSave}>💾 Save Changes</button>
        <button className="logout-btn" onClick={handleLogout}>🚪 Logout</button>
      </div>
    </div>
  );
}
