import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRole }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token || role !== allowedRole) {
    return <Navigate to="/" />; // redirect to login if not authorized
  }

  return children;
}
