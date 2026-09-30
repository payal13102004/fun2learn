import React, { useEffect, useState } from "react";
import styles from "./Books.module.css";
import { FaBook, FaSearch, FaFilter } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Books() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [student, setStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All");

  useEffect(() => {
    // 🧠 Step 1: Get logged-in student details
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setStudent(user);

    // 🧠 Step 2: Fetch books added by admin
    const adminBooks = JSON.parse(localStorage.getItem("books") || "[]");

    // 🧾 Step 3: Filter books according to student's standard
    let filteredBooks = [];
    if (user?.standard) {
      filteredBooks = adminBooks.filter(
        (book) => parseInt(book.standard) === parseInt(user.standard)
      );
    }

    // 🧩 Step 4: Fallback default books if none found
    const defaultBooks = [
      {
        title: "Mathematics Basics",
        subject: "Math",
        link: "https://www.math.brown.edu/~res/MFS/handout8.pdf",
        thumbnail:
          "https://img.freepik.com/free-vector/maths-book-cover-design_1308-133177.jpg",
        standard: 1,
      },
      {
        title: "Science Fundamentals",
        subject: "Science",
        link: "https://ncert.nic.in/textbook/pdf/hesc101.pdf",
        thumbnail:
          "https://img.freepik.com/free-vector/science-book-cover-template_1308-116965.jpg",
        standard: 2,
      },
      {
        title: "English Grammar Mastery",
        subject: "English",
        link: "https://www.emgywomenscollege.ac.in/templateEditor/kcfinder/upload/files/-Free-English-Grammar.pdf",
        thumbnail:
          "https://img.freepik.com/free-vector/english-book-cover-design_1308-133180.jpg",
        standard: 3,
      },
    ];

    // 🧩 Step 5: Final book list
    const finalBooks = filteredBooks.length > 0 ? filteredBooks : defaultBooks;

    // 📚 Sort alphabetically by subject
    finalBooks.sort((a, b) => (a.subject > b.subject ? 1 : -1));

    setBooks(finalBooks);
  }, []);

  // 📑 Extract unique subjects for dropdown
  const subjects = ["All", ...new Set(books.map((b) => b.subject || "N/A"))];

  // 🔍 Filter books by search and subject
  const visibleBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject =
      selectedSubject === "All" || book.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  return (
    <div className={styles.wrapper}>
      {/* 🔙 Back Button */}
      <button className={styles.backBtn} onClick={() => navigate(-1)}>
        ← Back
      </button>

      <h2>📚 My Books {student?.standard ? `(Std ${student.standard})` : ""}</h2>

      {/* 🔍 Search and Filter Bar */}
      <div className={styles.filterBar}>
        <div className={styles.searchBar}>
          <FaSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search by title or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className={styles.dropdownWrapper}>
          <FaFilter className={styles.filterIcon} />
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
          >
            {subjects.map((subject, idx) => (
              <option key={idx} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 📘 Book Display */}
      {visibleBooks.length === 0 ? (
        <p className={styles.noData}>No books found for your filter.</p>
      ) : (
        <div className={styles.grid}>
          {visibleBooks.map((book, idx) => (
            <motion.div
              key={idx}
              className={styles.card}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              {/* 🖼 Thumbnail */}
              <div className={styles.thumbnailWrapper}>
                {book.thumbnail ? (
                  <img
                    src={book.thumbnail}
                    alt={book.title}
                    className={styles.thumbnail}
                    loading="lazy"
                  />
                ) : (
                  <FaBook className={styles.icon} />
                )}
              </div>

              {/* 📘 Book Info */}
              <div className={styles.details}>
                <h3>{book.title}</h3>
                <small>Subject: {book.subject || "N/A"}</small>
                <small>Standard: {book.standard}</small>
              </div>

              {/* 🔗 Open Book */}
              {book.link ? (
                <button
                  className={styles.viewBtn}
                  onClick={() => {
                    try {
                      if (!book.link || book.link.trim() === "") {
                        alert("Book link is not available");
                        return;
                      }
                      
                      console.log("Opening book:", book.title, "Link:", book.link);
                      
                      const newWindow = window.open(book.link, "_blank", "noopener,noreferrer");
                      
                      if (!newWindow || newWindow.closed || typeof newWindow.closed === "undefined") {
                        alert("Please allow popups for this site to view books. Check your browser settings.");
                        console.error("Popup blocked for:", book.link);
                      } else {
                        console.log("Book opened successfully");
                      }
                    } catch (error) {
                      console.error("Error opening book:", error);
                      alert("Failed to open book. Error: " + error.message);
                    }
                  }}
                >
                  View Book
                </button>
              ) : (
                <p className={styles.noLink}>No Link Provided</p>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
