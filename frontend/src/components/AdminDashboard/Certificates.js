// src/components/Certificates.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import "./Certificates.css";

export default function Certificates() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [selectedCert, setSelectedCert] = useState(null);
  const COLORS = ["#4fc3f7", "#ff8a80", "#ffd54f"];

  useEffect(() => {
    // Load all student certificates from localStorage
    const students = JSON.parse(localStorage.getItem("students") || "[]");
    const allCertificates = [];

    students.forEach((student) => {
      if (student.certificates && student.certificates.length > 0) {
        student.certificates.forEach((cert) => {
          allCertificates.push({
            studentName: student.name,
            studentEmail: student.email,
            course: cert.title || cert.subject,
            subject: cert.subject,
            standard: cert.standard,
            date: cert.date,
            score: cert.score,
            correctAnswers: cert.correctAnswers,
            incorrectAnswers: cert.incorrectAnswers,
            totalQuestions: cert.totalQuestions,
            status: "Active",
          });
        });
      }
    });

    setCertificates(allCertificates);

    // Generate monthly data based on certificates
    const monthlyData = [
      { month: "Jan", issued: 0 },
      { month: "Feb", issued: 0 },
      { month: "Mar", issued: 0 },
      { month: "Apr", issued: 0 },
      { month: "May", issued: 0 },
      { month: "Jun", issued: 0 },
    ];

    allCertificates.forEach((cert) => {
      if (cert.date) {
        const month = new Date(cert.date).toLocaleString("en", { month: "short" });
        const monthData = monthlyData.find((m) => m.month === month);
        if (monthData) monthData.issued++;
      }
    });

    setData(monthlyData);

    // Certificate status distribution
    setStatusData([
      { name: "Active", value: allCertificates.length },
      { name: "Revoked", value: 0 },
      { name: "Pending", value: 0 },
    ]);
  }, []);

  const handleBack = () => {
    navigate("/admin-dashboard");
  };

  const handleViewCertificate = (cert) => {
    setSelectedCert(cert);
  };

  const handleCloseCertificate = () => {
    setSelectedCert(null);
  };

  const handlePrintCertificate = () => {
    window.print();
  };

  return (
    <div className="certificates-container">
      {/* Header */}
      <div className="certificates-header">
        <h2 className="certificates-title">Certificates Management</h2>
        <button className="back-btn" onClick={handleBack}>
          ← Back
        </button>
      </div>

      {/* Summary Cards */}
      <div className="cert-cards">
        <div className="cert-card">
          <h3>Total Certificates</h3>
          <p>{certificates.length}</p>
        </div>
        <div className="cert-card">
          <h3>Active</h3>
          <p>{certificates.filter((c) => c.status === "Active").length}</p>
        </div>
        <div className="cert-card">
          <h3>Students Certified</h3>
          <p>{new Set(certificates.map((c) => c.studentEmail)).size}</p>
        </div>
        <div className="cert-card">
          <h3>Subjects Covered</h3>
          <p>{new Set(certificates.map((c) => c.subject)).size}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="cert-charts">
        <div className="chart-box">
          <h3>Certificates Issued (Monthly)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="issued" fill="#4fc3f7" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-box">
          <h3>Certificate Status Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={70}
                label
              >
                {statusData.map((entry, idx) => (
                  <Cell key={idx} fill={COLORS[idx]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Certificate Table */}
      <div className="table-section">
        <h3>Issued Certificates</h3>
        <div className="table-wrap">
          <table className="cert-table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Course</th>
                <th>Subject</th>
                <th>Standard</th>
                <th>Score</th>
                <th>Correct</th>
                <th>Incorrect</th>
                <th>Date Issued</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {certificates.length > 0 ? (
                certificates.map((cert, idx) => (
                  <tr key={idx}>
                    <td>{cert.studentName}</td>
                    <td>{cert.course}</td>
                    <td>{cert.subject}</td>
                    <td>{cert.standard}</td>
                    <td>{cert.score}%</td>
                    <td style={{ color: "#28a745", fontWeight: "bold" }}>
                      {cert.correctAnswers || "N/A"}
                    </td>
                    <td style={{ color: "#dc3545", fontWeight: "bold" }}>
                      {cert.incorrectAnswers || "N/A"}
                    </td>
                    <td>{cert.date}</td>
                    <td>
                      <button
                        className="view-cert-btn"
                        onClick={() => handleViewCertificate(cert)}
                      >
                        👁️ View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" style={{ textAlign: "center" }}>
                    No certificates issued yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Certificate Modal */}
      {selectedCert && (
        <div className="cert-modal-overlay" onClick={handleCloseCertificate}>
          <div className="cert-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={handleCloseCertificate}>✕</button>

            <div className="certificate-preview">
              {(() => {
                const themes = {
                  Math:    { kid: "👨‍🚀", planet: "🪐", rocket: "🚀" },
                  Science: { kid: "🧑‍🔬", planet: "🌍", rocket: "🔭" },
                  English: { kid: "🧑‍💻", planet: "📖", rocket: "✏️" },
                  History: { kid: "🧑‍🎓", planet: "🏛️", rocket: "📜" },
                  EVS:     { kid: "🧑‍🌾", planet: "🌿", rocket: "🌱" },
                };
                const t = themes[selectedCert.subject] || { kid: "🧒", planet: "🪐", rocket: "🚀" };
                return (
                  <div className="cert-kids-card">
                    {/* Corner badges */}
                    <div className="cert-corner cert-corner-tl">🔵</div>
                    <div className="cert-corner cert-corner-tr">🔵</div>
                    <div className="cert-corner cert-corner-bl">🔵</div>
                    <div className="cert-corner cert-corner-br">🔵</div>
                    {/* Stars */}
                    <span className="cert-star" style={{top:"18%",left:"28%"}}>⭐</span>
                    <span className="cert-star" style={{top:"14%",right:"22%"}}>✨</span>
                    <span className="cert-star" style={{top:"42%",right:"14%"}}>⭐</span>
                    <span className="cert-star" style={{bottom:"30%",left:"22%"}}>💫</span>
                    {/* Planet */}
                    <div className="cert-planet">{t.planet}</div>
                    {/* Rocket */}
                    <div className="cert-rocket">{t.rocket}</div>
                    {/* Kid */}
                    <div className="cert-kid">{t.kid}</div>
                    {/* Medal */}
                    <div className="cert-medal-wrap">
                      <div className="cert-medal">
                        <span className="cert-medal-star">⭐</span>
                      </div>
                      <div className="cert-medal-ribbon"></div>
                    </div>
                    <h1 className="cert-main-title">Certificate of Completion</h1>
                    <p className="cert-presented">This certificate is proudly presented to</p>
                    <h2 className="cert-student-name">{selectedCert.studentName}</h2>
                    <p className="cert-description">For successfully completing</p>
                    <h3 className="cert-course-name">{selectedCert.subject || selectedCert.course}</h3>
                    {selectedCert.score !== undefined && (
                      <div className="cert-score-row">
                        <div className="cert-score-box" style={{ borderColor: "#1565c0" }}>
                          <span className="cert-score-icon">💯</span>
                          <span className="cert-score-num" style={{ color: "#1565c0" }}>{selectedCert.score}%</span>
                          <span className="cert-score-lbl">Score</span>
                        </div>
                        <div className="cert-score-box" style={{ borderColor: "#28a745" }}>
                          <span className="cert-score-icon">✅</span>
                          <span className="cert-score-num" style={{ color: "#28a745" }}>{selectedCert.correctAnswers ?? "—"}</span>
                          <span className="cert-score-lbl">Correct</span>
                        </div>
                        <div className="cert-score-box" style={{ borderColor: "#dc3545" }}>
                          <span className="cert-score-icon">❌</span>
                          <span className="cert-score-num" style={{ color: "#dc3545" }}>{selectedCert.incorrectAnswers ?? "—"}</span>
                          <span className="cert-score-lbl">Incorrect</span>
                        </div>
                      </div>
                    )}
                    <div className="cert-footer-row">
                      <p className="cert-date-txt">Date: {selectedCert.date}</p>
                      <p className="cert-brand-txt">Fun2Learn</p>
                    </div>
                  </div>
                );
              })()}
            </div>

            <button className="print-cert-btn" onClick={handlePrintCertificate}>
              🖨️ Print Certificate
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
