import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Quizzes.module.css";

const emptyQuestion = () => ({
  question: "",
  options: ["", "", "", ""],
  answer: "",
});

export default function Quizzes() {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [selectedStandard, setSelectedStandard] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [quizTitle, setQuizTitle] = useState("");
  const [quizSubject, setQuizSubject] = useState("");
  const [quizStandard, setQuizStandard] = useState("");
  const [questions, setQuestions] = useState([emptyQuestion()]);

  // PDF states
  const [pdfParsing, setPdfParsing] = useState(false);
  const [pdfStatus, setPdfStatus] = useState("");
  const fileInputRef = useRef(null);

  // ── PDF Parser using pdfjs-dist v5 ──
  const parsePdfToQuestions = async (file) => {
    setPdfParsing(true);
    setPdfStatus("📄 Reading PDF...");
    try {
      const arrayBuffer = await file.arrayBuffer();

      const pdfjsLib = await import("pdfjs-dist");
      // Use public folder worker
      pdfjsLib.GlobalWorkerOptions.workerSrc = `${window.location.origin}/pdf.worker.mjs`;

      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = "";

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items.map((item) => item.str).join(" ");
        fullText += pageText + "\n";
      }

      setPdfStatus("🔍 Extracting questions...");
      const parsed = extractQuestionsFromText(fullText);

      if (parsed.length === 0) {
        setPdfStatus("⚠️ No questions found. Please check PDF format below.");
        setPdfParsing(false);
        return;
      }

      setQuestions(parsed);
      setPdfStatus(`✅ ${parsed.length} question(s) extracted! Review and save.`);
    } catch (err) {
      console.error("PDF parse error:", err);
      setPdfStatus("❌ Failed to parse PDF. Try a text-based PDF.");
    }
    setPdfParsing(false);
  };

  // ── Extract Q&A from text ──
  const extractQuestionsFromText = (text) => {
    const results = [];
    const lines = text.split(/\n/).map(l => l.trim()).filter(Boolean);
    const fullText = lines.join("\n");

    // Pattern 1: Q1. / 1. question followed by a) b) c) d) and Answer:
    // Pattern 2: Question on one line, options on next lines
    const qPattern = /(?:Q\.?\s*\d+[\.\):]?|^\d+[\.\)])\s*(.+?)(?=\n[A-Da-d][\.\):]|\s+[A-Da-d][\.\):])/gms;
    const optPattern = /[A-Da-d][\.\):]\s*([^\n]+)/gi;
    const ansPattern = /(?:Ans(?:wer)?[:\s.]+)([A-Da-d])/i;

    // Split text into question blocks
    const blocks = fullText.split(/(?=(?:Q\.?\s*\d+[\.\):]|\n\d+[\.\)]))/gi);

    for (const block of blocks) {
      if (!block.trim()) continue;

      // Get question text
      const qLine = block.match(/(?:Q\.?\s*\d+[\.\):]?|\d+[\.\)])\s*(.+?)(?=\s+[A-Da-d][\.\):])/si);
      if (!qLine) continue;

      const questionText = qLine[1].replace(/\s+/g, " ").trim();
      if (questionText.length < 4) continue;

      // Get options
      const opts = [...block.matchAll(/[A-Da-d][\.\):]\s*([^\nA-Da-d]+?)(?=[A-Da-d][\.\):]|Ans|Answer|$)/gis)];
      if (opts.length < 2) continue;

      const options = opts.slice(0, 4).map(m => m[1].replace(/\s+/g, " ").trim());
      while (options.length < 4) options.push("");

      // Get answer
      const ansMatch = block.match(ansPattern);
      let answer = "";
      if (ansMatch) {
        const idx = ["a","b","c","d"].indexOf(ansMatch[1].toLowerCase());
        if (idx >= 0 && options[idx]) answer = options[idx];
      }

      results.push({ question: questionText, options, answer });
    }

    return results;
  };

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("adminQuizzes") || "[]");
    setQuizzes(stored);
  }, []);

  const saveToStorage = (updated) => {
    setQuizzes(updated);
    localStorage.setItem("adminQuizzes", JSON.stringify(updated));
  };

  // ── Question handlers ──
  const handleQuestionChange = (idx, value) => {
    const updated = [...questions];
    updated[idx].question = value;
    setQuestions(updated);
  };

  const handleOptionChange = (qIdx, oIdx, value) => {
    const updated = [...questions];
    updated[qIdx].options[oIdx] = value;
    setQuestions(updated);
  };

  const handleAnswerChange = (qIdx, value) => {
    const updated = [...questions];
    updated[qIdx].answer = value;
    setQuestions(updated);
  };

  const addQuestion = () => setQuestions([...questions, emptyQuestion()]);

  const removeQuestion = (idx) => {
    if (questions.length === 1) return;
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  // ── Submit ──
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!quizTitle.trim() || !quizStandard || !quizSubject.trim()) {
      alert("Please fill title, subject and standard");
      return;
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question.trim()) { alert(`Question ${i + 1} is empty`); return; }
      if (q.options.some((o) => !o.trim())) { alert(`All options in Q${i + 1} must be filled`); return; }
      if (!q.answer.trim()) { alert(`Select correct answer for Q${i + 1}`); return; }
    }

    if (editId !== null) {
      const updated = quizzes.map((q) =>
        q.id === editId
          ? { ...q, title: quizTitle, subject: quizSubject, standard: Number(quizStandard), questions }
          : q
      );
      saveToStorage(updated);
      alert("✅ Quiz updated!");
    } else {
      const newQuiz = {
        id: Date.now(),
        title: quizTitle,
        subject: quizSubject,
        standard: Number(quizStandard),
        questions,
        completed: 0,
      };
      saveToStorage([...quizzes, newQuiz]);
      alert("✅ Quiz added!");
    }

    resetForm();
  };

  const resetForm = () => {
    setShowForm(false);
    setEditId(null);
    setQuizTitle("");
    setQuizSubject("");
    setQuizStandard("");
    setQuestions([emptyQuestion()]);
  };

  const handleEdit = (quiz) => {
    setEditId(quiz.id);
    setQuizTitle(quiz.title);
    setQuizSubject(quiz.subject || "");
    setQuizStandard(String(quiz.standard));
    setQuestions(quiz.questions?.length ? quiz.questions : [emptyQuestion()]);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this quiz?")) {
      saveToStorage(quizzes.filter((q) => q.id !== id));
    }
  };

  const filteredQuizzes =
    selectedStandard === "all"
      ? quizzes
      : quizzes.filter((q) => q.standard === Number(selectedStandard));

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>🧠 Quizzes Management</h2>
        <div style={{ display: "flex", gap: 10 }}>
          <button className={styles.addNewBtn} onClick={() => { resetForm(); setShowForm(true); }}>
            ➕ Add New Quiz
          </button>
          <button className={styles.backBtn} onClick={() => navigate("/admin-dashboard")}>
            ← Back
          </button>
        </div>
      </div>

      {/* ── Quiz Builder Form ── */}
      {showForm && (
        <div className={styles.formCard}>
          <h3>{editId ? "✏️ Edit Quiz" : "➕ Create New Quiz"}</h3>
          <form onSubmit={handleSubmit}>
            {/* Basic Info */}
            <div className={styles.formRow}>
              <input
                className={styles.input}
                type="text"
                placeholder="Quiz Title *"
                value={quizTitle}
                onChange={(e) => setQuizTitle(e.target.value)}
                required
              />
              <input
                className={styles.input}
                type="text"
                placeholder="Subject (e.g. Math, Science) *"
                value={quizSubject}
                onChange={(e) => setQuizSubject(e.target.value)}
                required
              />
              <select
                className={styles.input}
                value={quizStandard}
                onChange={(e) => setQuizStandard(e.target.value)}
                required
              >
                <option value="">Select Standard *</option>
                {[1,2,3,4,5,6,7,8,9,10].map((s) => (
                  <option key={s} value={s}>Standard {s}</option>
                ))}
              </select>
            </div>

            {/* ── PDF Upload Section ── */}
            <div className={styles.pdfSection}>
              <div className={styles.pdfHeader}>
                <span>📄 Auto-Generate from PDF</span>
                <small>Upload a PDF with Q&A format to auto-extract questions</small>
              </div>
              <div className={styles.pdfUploadRow}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) parsePdfToQuestions(file);
                  }}
                />
                <button
                  type="button"
                  className={styles.pdfBtn}
                  onClick={() => fileInputRef.current.click()}
                  disabled={pdfParsing}
                >
                  {pdfParsing ? "⏳ Parsing..." : "📤 Upload PDF"}
                </button>
                {pdfStatus && (
                  <span className={`${styles.pdfStatus} ${
                    pdfStatus.startsWith("✅") ? styles.pdfSuccess :
                    pdfStatus.startsWith("❌") || pdfStatus.startsWith("⚠️") ? styles.pdfError :
                    styles.pdfInfo
                  }`}>
                    {pdfStatus}
                  </span>
                )}
              </div>
              <div className={styles.pdfHint}>
                <strong>PDF Format Guide:</strong>
                <code>Q1. What is 2+2? A. 1 B. 2 C. 4 D. 5 Answer: C</code>
              </div>
            </div>

            {/* Questions */}
            <h4 className={styles.qHeader}>📝 Questions ({questions.length})</h4>
            {questions.map((q, qIdx) => (
              <div key={qIdx} className={styles.questionCard}>
                <div className={styles.questionTop}>
                  <span className={styles.qNum}>Q{qIdx + 1}</span>
                  <button
                    type="button"
                    className={styles.removeQBtn}
                    onClick={() => removeQuestion(qIdx)}
                  >
                    ✕
                  </button>
                </div>

                <input
                  className={styles.input}
                  type="text"
                  placeholder={`Question ${qIdx + 1} *`}
                  value={q.question}
                  onChange={(e) => handleQuestionChange(qIdx, e.target.value)}
                  required
                />

                <div className={styles.optionsGrid}>
                  {q.options.map((opt, oIdx) => (
                    <div key={oIdx} className={styles.optionRow}>
                      <span className={styles.optLabel}>
                        {["A", "B", "C", "D"][oIdx]}
                      </span>
                      <input
                        className={styles.optInput}
                        type="text"
                        placeholder={`Option ${["A","B","C","D"][oIdx]} *`}
                        value={opt}
                        onChange={(e) => handleOptionChange(qIdx, oIdx, e.target.value)}
                        required
                      />
                    </div>
                  ))}
                </div>

                <div className={styles.answerRow}>
                  <label>✅ Correct Answer:</label>
                  <select
                    className={styles.answerSelect}
                    value={q.answer}
                    onChange={(e) => handleAnswerChange(qIdx, e.target.value)}
                    required
                  >
                    <option value="">-- Select --</option>
                    {q.options.map((opt, oIdx) =>
                      opt.trim() ? (
                        <option key={oIdx} value={opt}>
                          {["A","B","C","D"][oIdx]}: {opt}
                        </option>
                      ) : null
                    )}
                  </select>
                </div>
              </div>
            ))}

            <button type="button" className={styles.addQBtn} onClick={addQuestion}>
              ➕ Add Another Question
            </button>

            <div className={styles.formActions}>
              <button type="submit" className={styles.saveBtn}>
                💾 {editId ? "Update Quiz" : "Save Quiz"}
              </button>
              <button type="button" className={styles.cancelBtn} onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Filter ── */}
      <div className={styles.filterSection}>
        <label>Filter by Standard:</label>
        <select
          value={selectedStandard}
          onChange={(e) => setSelectedStandard(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="all">All</option>
          {[1,2,3,4,5,6,7,8,9,10].map((s) => (
            <option key={s} value={s}>Standard {s}</option>
          ))}
        </select>
      </div>

      {/* ── Quiz Table ── */}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>#</th>
            <th>Quiz Title</th>
            <th>Subject</th>
            <th>Standard</th>
            <th>Questions</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredQuizzes.length > 0 ? (
            filteredQuizzes.map((quiz, idx) => (
              <tr key={quiz.id}>
                <td>{idx + 1}</td>
                <td>{quiz.title}</td>
                <td>{quiz.subject || "—"}</td>
                <td>{quiz.standard}</td>
                <td>{quiz.questions?.length || 0}</td>
                <td>
                  <button className={styles.actionBtn} onClick={() => handleEdit(quiz)}>
                    ✏️ Edit
                  </button>
                  <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => handleDelete(quiz.id)}>
                    🗑 Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className={styles.noData}>
                No quizzes found. Click "Add New Quiz" to create one.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
