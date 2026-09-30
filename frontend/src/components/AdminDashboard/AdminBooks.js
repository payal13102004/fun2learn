import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AdminBooks.module.css";

export default function AdminBooks() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({
    title: "",
    subject: "",
    standard: "",
    link: "",
    
  });

  // Load saved books
  useEffect(() => {
    const savedBooks = JSON.parse(localStorage.getItem("books") || "[]");
    setBooks(savedBooks);
  }, []);

  // Save to localStorage when updated
  useEffect(() => {
    localStorage.setItem("books", JSON.stringify(books));
  }, [books]);

  // Add Book
  const handleAddBook = (e) => {
    e.preventDefault();
    if (!newBook.title || !newBook.link || !newBook.standard) {
      alert("Please fill in title, standard, and link!");
      return;
    }

    const newEntry = {
      id: Date.now(),
      ...newBook,
    };

    setBooks([...books, newEntry]);
    setNewBook({ title: "", subject: "", standard: "", link: "", thumbnail: "" });
    alert("✅ Book added successfully!");
  };

  // Delete Book
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      setBooks(books.filter((b) => b.id !== id));
    }
  };

  // Group books by standard
  const booksByStandard = books.reduce((groups, book) => {
    const std = book.standard || "Unspecified";
    if (!groups[std]) groups[std] = [];
    groups[std].push(book);
    return groups;
  }, {});

  return (
    <div className={styles.container}>
      <button className={styles.backBtn} onClick={() => navigate("/admin-dashboard")}>
        ← Back
      </button>

      <h2>📚 Admin Book Management</h2>

      {/* Add Book Form */}
      <form className={styles.form} onSubmit={handleAddBook}>
        <input
          type="text"
          placeholder="Book title"
          value={newBook.title}
          onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
          required
        />

        <input
          type="text"
          placeholder="Subject"
          value={newBook.subject}
          onChange={(e) => setNewBook({ ...newBook, subject: e.target.value })}
        />

        <select
          value={newBook.standard}
          onChange={(e) => setNewBook({ ...newBook, standard: e.target.value })}
          required
        >
          <option value="">Select Standard</option>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, ].map((std) => (
            <option key={std} value={`Standard ${std}`}>
              Standard {std}
            </option>
          ))}
        </select>

        <input
          type="url"
          placeholder="PDF link"
          value={newBook.link}
          onChange={(e) => setNewBook({ ...newBook, link: e.target.value })}
          required
        />

        

        <button type="submit">Add Book</button>
      </form>

      {/* Book List by Standard */}
      <div className={styles.bookList}>
        {Object.keys(booksByStandard).length === 0 ? (
          <p>No books added yet.</p>
        ) : (
          Object.entries(booksByStandard).map(([standard, stdBooks]) => (
            <div key={standard} className={styles.standardSection}>
              <h3>{standard}</h3>
              <div className={styles.standardGrid}>
                {stdBooks.map((book) => (
                  <div key={book.id} className={styles.card}>
                    <img
                      src={
                        book.thumbnail ||
                        "https://cdn-icons-png.flaticon.com/512/29/29302.png"
                      }
                      alt={book.title}
                      className={styles.thumbnail}
                    />
                    <div className={styles.details}>
                      <h4>{book.title}</h4>
                      <small>Subject: {book.subject || "N/A"}</small>
                      <a href={book.link} target="_blank" rel="noreferrer">
                        📖 View PDF
                      </a>
                    </div>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => handleDelete(book.id)}
                    >
                      🗑 Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
