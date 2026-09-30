import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, RadarChart,
  Radar, PolarGrid, PolarAngleAxis,
} from "recharts";
import "./Reports.css";

const COLORS = ["#4fc3f7", "#69f0ae", "#ffd54f", "#ff8a80", "#ce93d8", "#80cbc4"];

export default function Reports() {
  const navigate = useNavigate();

  // Real data from localStorage
  const [students, setStudents] = useState([]);
  const [summary, setSummary] = useState({
    totalStudents: 0,
    totalCertificates: 0,
    totalQuizzes: 0,
    avgScore: 0,
    activeStandards: 0,
    videosWatched: 0,
  });
  const [standardData, setStandardData] = useState([]);
  const [subjectData, setSubjectData] = useState([]);
  const [scoreDistribution, setScoreDistribution] = useState([]);
  const [topStudents, setTopStudents] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [printMode, setPrintMode] = useState(false);

  useEffect(() => {
    const storedStudents = JSON.parse(localStorage.getItem("students") || "[]");
    setStudents(storedStudents);

    // ── Summary Stats ──
    let totalCerts = 0;
    let totalQuizAttempts = 0;
    let totalScore = 0;
    let scoreCount = 0;
    let totalVideos = 0;
    const standardMap = {};
    const subjectMap = {};
    const scoreRanges = { "0-40": 0, "41-60": 0, "61-80": 0, "81-100": 0 };

    storedStudents.forEach((s) => {
      // Certificates
      const certs = s.certificates || [];
      totalCerts += certs.length;

      // Quiz scores
      certs.forEach((c) => {
        if (c.score !== undefined) {
          totalScore += c.score;
          scoreCount++;
          totalQuizAttempts++;

          // Score distribution
          if (c.score <= 40) scoreRanges["0-40"]++;
          else if (c.score <= 60) scoreRanges["41-60"]++;
          else if (c.score <= 80) scoreRanges["61-80"]++;
          else scoreRanges["81-100"]++;

          // Subject data
          const subj = c.subject || "Other";
          if (!subjectMap[subj]) subjectMap[subj] = { subject: subj, count: 0, totalScore: 0 };
          subjectMap[subj].count++;
          subjectMap[subj].totalScore += c.score;
        }
      });

      // Standard data
      const std = s.standard || s.std || "N/A";
      if (!standardMap[std]) standardMap[std] = { standard: `Std ${std}`, students: 0, certs: 0 };
      standardMap[std].students++;
      standardMap[std].certs += certs.length;

      // Videos
      totalVideos += s.videosWatched || 0;
    });

    setSummary({
      totalStudents: storedStudents.length,
      totalCertificates: totalCerts,
      totalQuizzes: totalQuizAttempts,
      avgScore: scoreCount > 0 ? Math.round(totalScore / scoreCount) : 0,
      activeStandards: Object.keys(standardMap).length,
      videosWatched: totalVideos,
    });

    // Standard chart data
    setStandardData(
      Object.values(standardMap).sort((a, b) =>
        parseInt(a.standard.replace("Std ", "")) - parseInt(b.standard.replace("Std ", ""))
      )
    );

    // Subject chart data
    setSubjectData(
      Object.values(subjectMap).map((s) => ({
        subject: s.subject,
        count: s.count,
        avgScore: Math.round(s.totalScore / s.count),
      }))
    );

    // Score distribution
    setScoreDistribution(
      Object.entries(scoreRanges).map(([range, count]) => ({ range, count }))
    );

    // Top students by certificates
    const sorted = [...storedStudents]
      .filter((s) => s.certificates?.length > 0)
      .sort((a, b) => (b.certificates?.length || 0) - (a.certificates?.length || 0))
      .slice(0, 5)
      .map((s) => ({
        name: s.name || s.email,
        certs: s.certificates?.length || 0,
        avgScore: s.certificates?.length
          ? Math.round(s.certificates.reduce((sum, c) => sum + (c.score || 0), 0) / s.certificates.length)
          : 0,
        standard: s.standard || "—",
      }));
    setTopStudents(sorted);
  }, []);

  // ── Export CSV ──
  const exportCSV = () => {
    const rows = [
      ["Student Name", "Email", "Standard", "Certificates", "Avg Score", "Videos Watched"],
      ...students.map((s) => [
        s.name || "—",
        s.email,
        s.standard || "—",
        s.certificates?.length || 0,
        s.certificates?.length
          ? Math.round(s.certificates.reduce((sum, c) => sum + (c.score || 0), 0) / s.certificates.length)
          : 0,
        s.videosWatched || 0,
      ]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "fun2learn_report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    setPrintMode(true);
    setTimeout(() => { window.print(); setPrintMode(false); }, 300);
  };

  const tabs = ["overview", "students", "subjects", "performance"];

  return (
    <div className={`reports-container ${printMode ? "print-mode" : ""}`}>
      {/* ── Header ── */}
      <div className="reports-header">
        <div>
          <h2 className="reports-title">📊 Reports & Analytics</h2>
          <p className="reports-subtitle">Real-time data from Fun2Learn platform</p>
        </div>
        <div className="header-actions">
          <button className="export-btn" onClick={exportCSV}>📥 Export CSV</button>
          <button className="print-btn" onClick={handlePrint}>🖨️ Print</button>
          <button className="back-btn" onClick={() => navigate("/admin-dashboard")}>← Back</button>
        </div>
      </div>

      {/* ── Summary Cards ── */}
      <div className="report-cards">
        {[
          { label: "Total Students", value: summary.totalStudents, icon: "👨‍🎓", color: "#4fc3f7" },
          { label: "Certificates Issued", value: summary.totalCertificates, icon: "🏆", color: "#69f0ae" },
          { label: "Quizzes Completed", value: summary.totalQuizzes, icon: "📝", color: "#ffd54f" },
          { label: "Avg Quiz Score", value: `${summary.avgScore}%`, icon: "💯", color: "#ff8a80" },
          { label: "Active Standards", value: summary.activeStandards, icon: "📚", color: "#ce93d8" },
          { label: "Videos Watched", value: summary.videosWatched, icon: "🎥", color: "#80cbc4" },
        ].map((card, i) => (
          <div className="report-card" key={i} style={{ borderTop: `4px solid ${card.color}` }}>
            <span className="card-icon">{card.icon}</span>
            <h3>{card.label}</h3>
            <p style={{ color: card.color }}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* ── Tabs ── */}
      <div className="tab-bar no-print">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? "tab-active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* ── Overview Tab ── */}
      {(activeTab === "overview" || printMode) && (
        <div className="tab-content">
          <div className="charts-grid">
            <div className="chart-box">
              <h3>📊 Students per Standard</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={standardData}>
                  <XAxis dataKey="standard" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="students" fill="#4fc3f7" radius={[6,6,0,0]} name="Students" />
                  <Bar dataKey="certs" fill="#69f0ae" radius={[6,6,0,0]} name="Certificates" />
                  <Legend />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-box">
              <h3>🎯 Score Distribution</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={scoreDistribution} dataKey="count" nameKey="range" cx="50%" cy="50%" outerRadius={80} label>
                    {scoreDistribution.map((_, idx) => (
                      <Cell key={idx} fill={COLORS[idx]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-box">
              <h3>📚 Quizzes by Subject</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={subjectData}>
                  <XAxis dataKey="subject" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#ffd54f" radius={[6,6,0,0]} name="Quizzes" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-box">
              <h3>💯 Avg Score by Subject</h3>
              <ResponsiveContainer width="100%" height={250}>
                <RadarChart data={subjectData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <Radar name="Avg Score" dataKey="avgScore" stroke="#ce93d8" fill="#ce93d8" fillOpacity={0.5} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* ── Students Tab ── */}
      {(activeTab === "students" || printMode) && (
        <div className="tab-content">
          <h3 className="section-title">🏅 Top Performing Students</h3>
          {topStudents.length > 0 ? (
            <table className="report-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Student Name</th>
                  <th>Standard</th>
                  <th>Certificates</th>
                  <th>Avg Score</th>
                  <th>Performance</th>
                </tr>
              </thead>
              <tbody>
                {topStudents.map((s, i) => (
                  <tr key={i}>
                    <td>{i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}</td>
                    <td>{s.name}</td>
                    <td>{s.standard}</td>
                    <td>{s.certs}</td>
                    <td>{s.avgScore}%</td>
                    <td>
                      <div className="score-bar-wrap">
                        <div className="score-bar" style={{ width: `${s.avgScore}%`, background: s.avgScore >= 80 ? "#69f0ae" : s.avgScore >= 60 ? "#ffd54f" : "#ff8a80" }}></div>
                        <span>{s.avgScore}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="no-data">No student data available yet.</p>
          )}

          <h3 className="section-title" style={{ marginTop: "2rem" }}>👥 All Students</h3>
          <table className="report-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Standard</th>
                <th>Certificates</th>
                <th>Videos Watched</th>
              </tr>
            </thead>
            <tbody>
              {students.length > 0 ? students.map((s, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{s.name || "—"}</td>
                  <td>{s.email}</td>
                  <td>{s.standard || "—"}</td>
                  <td>{s.certificates?.length || 0}</td>
                  <td>{s.videosWatched || 0}</td>
                </tr>
              )) : (
                <tr><td colSpan="6" className="no-data">No students registered yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Subjects Tab ── */}
      {(activeTab === "subjects" || printMode) && (
        <div className="tab-content">
          <h3 className="section-title">📚 Subject-wise Performance</h3>
          <table className="report-table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Quizzes Taken</th>
                <th>Avg Score</th>
                <th>Performance</th>
              </tr>
            </thead>
            <tbody>
              {subjectData.length > 0 ? subjectData.map((s, i) => (
                <tr key={i}>
                  <td>{s.subject}</td>
                  <td>{s.count}</td>
                  <td>{s.avgScore}%</td>
                  <td>
                    <div className="score-bar-wrap">
                      <div className="score-bar" style={{ width: `${s.avgScore}%`, background: s.avgScore >= 80 ? "#69f0ae" : s.avgScore >= 60 ? "#ffd54f" : "#ff8a80" }}></div>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="4" className="no-data">No quiz data available yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Performance Tab ── */}
      {(activeTab === "performance" || printMode) && (
        <div className="tab-content">
          <h3 className="section-title">📈 Certificate Details</h3>
          <table className="report-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Student</th>
                <th>Subject</th>
                <th>Standard</th>
                <th>Score</th>
                <th>Correct</th>
                <th>Incorrect</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {students.flatMap((s) =>
                (s.certificates || []).map((c, i) => ({
                  student: s.name || s.email,
                  ...c,
                  _key: `${s.email}-${i}`,
                }))
              ).length > 0 ? (
                students.flatMap((s) =>
                  (s.certificates || []).map((c, i) => (
                    <tr key={`${s.email}-${i}`}>
                      <td>{i + 1}</td>
                      <td>{s.name || s.email}</td>
                      <td>{c.subject}</td>
                      <td>{c.standard}</td>
                      <td style={{ color: c.score >= 70 ? "#2e7d32" : "#c62828", fontWeight: 700 }}>{c.score}%</td>
                      <td style={{ color: "#2e7d32" }}>{c.correctAnswers ?? "—"}</td>
                      <td style={{ color: "#c62828" }}>{c.incorrectAnswers ?? "—"}</td>
                      <td>{c.date}</td>
                    </tr>
                  ))
                )
              ) : (
                <tr><td colSpan="8" className="no-data">No certificate data yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Print footer */}
      {printMode && (
        <div className="print-footer">
          <p>Fun2Learn Admin Report — Generated on {new Date().toLocaleDateString()}</p>
        </div>
      )}
    </div>
  );
}
