import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

// 📦 Core Components
import HomePage from "./components/HomePage";
import LoginPage from "./components/LoginPage/LoginPage";
import RegisterPage from "./components/RegisterPage/RegisterPage";

// 🧑‍💼 Admin Components
import AdminDashboard from "./components/AdminDashboard/AdminDashboard";
import Students from "./components/AdminDashboard/Student";
import Standards from "./components/AdminDashboard/Standards";
import Courses from "./components/AdminDashboard/Courses";
import Reports from "./components/AdminDashboard/Reports";
import AdminSettings from "./components/AdminDashboard/Settings";
import CertificatePage from "./components/CertificatePage/CertificatePage";
import AdminQuizzes from "./components/AdminDashboard/Quizzes";
import AdminVideos from "./components/AdminDashboard/AdminVideos";
import AdminBooks from "./components/AdminDashboard/AdminBooks";


// 🎓 Student Components
import StudentDashboard from "./components/StudentDashboard/StudentDashboard";
import StudentProfile from "./components/Profile/StudentProfile";
import MyCourses from "./components/MyCourse/MyCourses";
import Progress from "./components/Progress/Progress";
import Achievements from "./components/Achievements/Achievements";
import Books from "./components/Books/Books";
import Videos from "./components/Videos/Videos";
import Quiz from "./components/QuizPage/QuizPage";
import StudentSettings from "./components/Settings/Setting";
import FutureEnhancements from "./components/FutureEnhancements/FutureEnhancements";

// 🧩 Protected Route Wrapper
function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const location = useLocation();

  if (!token) return <Navigate to="/login" state={{ from: location }} replace />;
  if (allowedRoles && !allowedRoles.includes(user.role))
    return <Navigate to="/" replace />;

  return children;
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setIsLoggedIn(!!token);
    setRole(user?.role || null);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setRole(null);
  };

  const handleLoginRedirect = (userRole) => {
    setIsLoggedIn(true);
    setRole(userRole);

    if (userRole === "admin") window.location.href = "/admin-dashboard";
    else if (userRole === "student") window.location.href = "/student-dashboard";
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* 🏠 Home Page */}
        <Route
          path="/"
          element={<HomePage isLoggedIn={isLoggedIn} onLogout={handleLogout} />}
        />

        {/* 🔑 Authentication */}
        <Route
          path="/login"
          element={<LoginPage onLogin={handleLoginRedirect} />}
        />
        <Route
          path="/register"
          element={<RegisterPage onRegister={handleLoginRedirect} />}
        />

        {/* 🧑‍💼 Admin Routes */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/students"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Students />
            </ProtectedRoute>
          }
        />
        <Route
          path="/standards"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Standards />
            </ProtectedRoute>
          }
        />
        <Route
          path="/courses"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Courses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-books"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminBooks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-quizzes"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminQuizzes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-videos"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminVideos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/certificates"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <CertificatePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Reports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminSettings />
            </ProtectedRoute>
          }
        />

        {/* 🎓 Student Routes */}
        <Route
          path="/student-dashboard"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentDashboard onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student-profile"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mycourses"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <MyCourses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/progress"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <Progress />
            </ProtectedRoute>
          }
        />
        <Route
          path="/achievements"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <Achievements />
            </ProtectedRoute>
          }
        />
        <Route
          path="/books"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <Books />
            </ProtectedRoute>
          }
        />
        <Route
          path="/videos"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <Videos />
            </ProtectedRoute>
          }
        />
        {/* ✅ New Quiz Page Route */}
        <Route
          path="/quiz"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <Quiz />
            </ProtectedRoute>
          }
        />
        <Route
          path="/certificate"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <CertificatePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student-settings"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentSettings />
            </ProtectedRoute>
          }
        />
        <Route path="/future-enhancements" element={<FutureEnhancements />} />

        {/* 🚫 Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
