import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./QuizPage.module.css";

export default function QuizPage() {
  const navigate = useNavigate();
  const [student, setStudent] = useState({});
  const [score, setScore] = useState(null);
  const [earnedCert, setEarnedCert] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selectedSubject, setSelectedSubject] = useState("");
  const [questions, setQuestions] = useState([]);
  const [quizStarted, setQuizStarted] = useState(false);
  const [selectedStandard, setSelectedStandard] = useState("");

  const subjectsPerStandard = {
    "1": ["Math", "English"],
    "2": ["Math", "Science"],
    "3": ["Math", "Science", "EVS"],
    "4": ["Math", "Science", "History"],
    "5": ["Math", "Science", "History"],
    "6": ["Math", "Science", "Geography"],
    "7": ["Math", "Science", "Civics"],
    "8": ["Math", "Science", "History", "Geography"],
    "9": ["Math", "Physics", "Biology", "History"],
    "10": ["Math", "Science", "History", "Civics"],
  };

  const allQuestions = {
    Math: [
      { question: "2 + 2 = ?", options: ["2", "3", "4", "5"], answer: "4" },
      { question: "5 × 6 = ?", options: ["10", "20", "25", "30"], answer: "30" },
      { question: "12 ÷ 4 = ?", options: ["2", "3", "4", "5"], answer: "3" },
      { question: "Square of 5?", options: ["10", "20", "25", "30"], answer: "25" },
      { question: "10 + 15 = ?", options: ["20", "25", "30", "15"], answer: "25" },
    ],
    Science: [
      { question: "H2O is called?", options: ["Oxygen", "Water", "Hydrogen", "Salt"], answer: "Water" },
      { question: "Earth revolves around?", options: ["Moon", "Sun", "Mars", "Venus"], answer: "Sun" },
      { question: "The Sun is a?", options: ["Planet", "Star", "Comet", "Asteroid"], answer: "Star" },
      { question: "Humans breathe?", options: ["CO2", "Oxygen", "Nitrogen", "Hydrogen"], answer: "Oxygen" },
      { question: "Photosynthesis occurs in?", options: ["Stem", "Roots", "Leaves", "Flower"], answer: "Leaves" },
    ],
    History: [
      { question: "Who discovered America?", options: ["Columbus", "Newton", "Einstein", "Darwin"], answer: "Columbus" },
      { question: "India got independence in?", options: ["1947", "1950", "1930", "1960"], answer: "1947" },
      { question: "Great Wall is in?", options: ["India", "China", "Japan", "USA"], answer: "China" },
      { question: "Who wrote 'Hamlet'?", options: ["Shakespeare", "Rowling", "Hemingway", "Tolkien"], answer: "Shakespeare" },
      { question: "World War II ended in?", options: ["1945", "1939", "1950", "1965"], answer: "1945" },
    ],
    English: [
      { question: "Synonym of 'Happy'?", options: ["Sad", "Angry", "Joyful", "Tired"], answer: "Joyful" },
      { question: "Antonym of 'Cold'?", options: ["Hot", "Cool", "Freeze", "Ice"], answer: "Hot" },
      { question: "Choose correct article: ___ apple", options: ["A", "An", "The", "No article"], answer: "An" },
      { question: "Plural of 'Child'?", options: ["Childs", "Children", "Childes", "Childrens"], answer: "Children" },
      { question: "Past of 'Go'?", options: ["Went", "Gone", "Going", "Goes"], answer: "Went" },
    ],
    EVS: [
      { question: "Which is the largest planet in our Solar System?", options: ["Earth", "Saturn", "Jupiter", "Mars"], answer: "Jupiter" },
      { question: "What do plants need to make their food?", options: ["Moonlight", "Sunlight", "Darkness", "Wind"], answer: "Sunlight" },
      { question: "Which gas do humans breathe out?", options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"], answer: "Carbon Dioxide" },
      { question: "Where do fish live?", options: ["Desert", "Forest", "Water", "Sky"], answer: "Water" },
      { question: "Which of these is a natural resource?", options: ["Plastic", "Glass", "Water", "Cloth"], answer: "Water" },
    ],
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user && user.standard) {
      setStudent(user);
      setSelectedStandard(String(user.standard));
    } else {
      alert("No student data found. Please log in again.");
      navigate("/login");
    }
  }, [navigate]);

  const handleStartQuiz = () => {
    if (!selectedSubject) {
      alert("Please select a subject before starting the quiz!");
      return;
    }
    setQuestions(allQuestions[selectedSubject] || []);
    setQuizStarted(true);
  };

  const handleOptionSelect = (option) => {
    setAnswers({ ...answers, [currentQuestion]: option });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) setCurrentQuestion(currentQuestion + 1);
  };

  const handlePrev = () => {
    if (currentQuestion > 0) setCurrentQuestion(currentQuestion - 1);
  };

  const handleQuizSubmit = () => {
    let correctAnswers = 0;
    let incorrectAnswers = 0;

    questions.forEach((q, i) => {
      if (answers[i] === q.answer) correctAnswers++;
      else incorrectAnswers++;
    });

    const obtainedScore = correctAnswers * 20;
    setScore(obtainedScore);

    // Save to localStorage
    const students = JSON.parse(localStorage.getItem("students") || "[]");
    let currentStudent = students.find((s) => s.email === student.email);

    if (!currentStudent) {
      currentStudent = {
        email: student.email,
        name: student.name,
        standard: selectedStandard,
        courses: [],
        certificates: [],
      };
      students.push(currentStudent);
    }

    if (!currentStudent.courses) currentStudent.courses = [];
    if (!currentStudent.certificates) currentStudent.certificates = [];

    let course = currentStudent.courses.find((c) => c.subject === selectedSubject);
    if (!course) {
      course = { subject: selectedSubject, quizzes: [] };
      currentStudent.courses.push(course);
    }

    course.quizzes = questions.map((q, i) => ({
      question: q.question,
      completed: true,
      selectedAnswer: answers[i],
      correctAnswer: q.answer,
      score: answers[i] === q.answer ? 20 : 0,
    }));

    // 🏆 Certificate if score >= 70
    let newCert = null;
    if (obtainedScore >= 70) {
      const certTitle = `Certificate in ${selectedSubject} (Std ${selectedStandard})`;
      const existingCerts = currentStudent.certificates || [];

      newCert = {
        title: certTitle,
        date: new Date().toLocaleDateString("en-GB"),
        subject: selectedSubject,
        standard: selectedStandard,
        score: obtainedScore,
        totalQuestions: questions.length,
        correctAnswers,
        incorrectAnswers,
      };

      const existingIdx = existingCerts.findIndex((c) => c.title === certTitle);
      if (existingIdx >= 0) {
        existingCerts[existingIdx] = newCert;
      } else {
        existingCerts.push(newCert);
      }
      currentStudent.certificates = existingCerts;
      setEarnedCert(newCert);

      // ✅ Save certificate to MongoDB
      const token = localStorage.getItem("token");
      if (token && token !== "fake-jwt-token") {
        fetch("http://localhost:5000/api/certificates/save", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newCert),
        })
          .then((r) => r.json())
          .then((d) => console.log("✅ Certificate saved to MongoDB:", d.message))
          .catch((err) => console.error("❌ Certificate save error:", err));
      }
    }

    localStorage.setItem("students", JSON.stringify(students));
    localStorage.setItem("lastQuizScore", obtainedScore);
  };

  const handleRetake = () => {
    setScore(null);
    setEarnedCert(null);
    setCurrentQuestion(0);
    setAnswers({});
    setQuizStarted(false);
  };

  return (
    <div className={styles.wrapper}>
      <button className={styles.backBtn} onClick={() => navigate(-1)}>
        ← Back
      </button>

      {/* Subject Selection */}
      {!quizStarted && (
        <div className={styles.selectionBox}>
          <h2>🎯 Quiz for Std {selectedStandard}</h2>
          <div className={styles.selectRow}>
            <label>Subject:</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              <option value="">-- Select Subject --</option>
              {(subjectsPerStandard[selectedStandard] || []).map((sub, i) => (
                <option key={i} value={sub}>{sub}</option>
              ))}
            </select>
          </div>
          <button className={styles.startBtn} onClick={handleStartQuiz}>
            ▶ Start Quiz
          </button>
        </div>
      )}

      {/* Quiz Questions */}
      {quizStarted && score === null && (
        <div className={styles.quizBox}>
          <h2>{selectedSubject} Quiz (Std {selectedStandard})</h2>
          <div className={styles.questionBox}>
            <p className={styles.questionText}>
              Q{currentQuestion + 1}. {questions[currentQuestion]?.question}
            </p>
            <div className={styles.options}>
              {questions[currentQuestion]?.options.map((opt, i) => (
                <button
                  key={i}
                  className={`${styles.optionBtn} ${
                    answers[currentQuestion] === opt ? styles.selected : ""
                  }`}
                  onClick={() => handleOptionSelect(opt)}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
          <div className={styles.navigation}>
            <button onClick={handlePrev} disabled={currentQuestion === 0}>
              ⬅ Previous
            </button>
            {currentQuestion < questions.length - 1 ? (
              <button onClick={handleNext}>Next ➡</button>
            ) : (
              <button className={styles.submitBtn} onClick={handleQuizSubmit}>
                ✅ Submit Quiz
              </button>
            )}
          </div>
          <p className={styles.progressText}>
            Question {currentQuestion + 1} of {questions.length}
          </p>
        </div>
      )}

      {/* Quiz Result */}
      {score !== null && (
        <div className={styles.resultBox}>
          <h3>🎯 Quiz Completed!</h3>
          <p className={styles.scoreText}>
            Your Score: <strong>{score}%</strong>
          </p>
          <p>
            {score >= 70
              ? "✅ Great job! You've earned a certificate!"
              : "❌ Keep practicing and try again."}
          </p>
          <div className={styles.resultButtons}>
            <button className={styles.retakeBtn} onClick={handleRetake}>
              🔄 Retake Quiz
            </button>
            {score >= 70 && earnedCert && (
              <button
                className={styles.certBtn}
                onClick={() => navigate("/certificate", { state: { certificate: earnedCert } })}
              >
                🏆 View Certificate
              </button>
            )}
            <button
              className={styles.progressBtn}
              onClick={() => navigate("/achievements")}
            >
              📊 Show Achievements
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
