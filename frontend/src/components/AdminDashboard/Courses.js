import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Courses.css";

const defaultCourses = [
  // Standard 1
  { id: 1, name: "Math 1", standard: 1 },
  { id: 2, name: "English 1", standard: 1 },
  { id: 3, name: "Science 1", standard: 1 },
  { id: 4, name: "Art 1", standard: 1 },
  // Standard 2
  { id: 5, name: "Math 2", standard: 2 },
  { id: 6, name: "English 2", standard: 2 },
  { id: 7, name: "Science 2", standard: 2 },
  { id: 8, name: "Art 2", standard: 2 },
  // Standard 3
  { id: 9, name: "Math 3", standard: 3 },
  { id: 10, name: "English 3", standard: 3 },
  { id: 11, name: "Science 3", standard: 3 },
  { id: 12, name: "Art 3", standard: 3 },
  // Standard 4
  { id: 13, name: "Math 4", standard: 4 },
  { id: 14, name: "English 4", standard: 4 },
  { id: 15, name: "Science 4", standard: 4 },
  { id: 16, name: "Art 4", standard: 4 },
  // Standard 5–10
  { id: 17, name: "Math 101", standard: 5 },
  { id: 18, name: "Science 101", standard: 5 },
  { id: 19, name: "English 101", standard: 5 },
  { id: 20, name: "History 101", standard: 5 },
  { id: 21, name: "Geography 101", standard: 5 },
  { id: 22, name: "Math 102", standard: 6 },
  { id: 23, name: "Science 102", standard: 6 },
  { id: 24, name: "English 102", standard: 6 },
  { id: 25, name: "History 102", standard: 6 },
  { id: 26, name: "Geography 102", standard: 6 },
  { id: 27, name: "Math 103", standard: 7 },
  { id: 28, name: "Physics 101", standard: 7 },
  { id: 29, name: "Chemistry 101", standard: 7 },
  { id: 30, name: "Biology 101", standard: 7 },
  { id: 31, name: "English 103", standard: 7 },
  { id: 32, name: "Math 201", standard: 8 },
  { id: 33, name: "Physics 102", standard: 8 },
  { id: 34, name: "Chemistry 102", standard: 8 },
  { id: 35, name: "Biology 102", standard: 8 },
  { id: 36, name: "English 201", standard: 8 },
  { id: 37, name: "Math 202", standard: 9 },
  { id: 38, name: "Physics 201", standard: 9 },
  { id: 39, name: "Chemistry 201", standard: 9 },
  { id: 40, name: "Biology 201", standard: 9 },
  { id: 41, name: "Math 203", standard: 10 },
  { id: 42, name: "Physics 202", standard: 10 },
  { id: 43, name: "Chemistry 202", standard: 10 },
  { id: 44, name: "Biology 202", standard: 10 },
];

export default function Courses() {
  const navigate = useNavigate();
  const [standard, setStandard] = useState(1);
  const [allCourses, setAllCourses] = useState(() => {
    const saved = localStorage.getItem("allCourses");
    return saved ? JSON.parse(saved) : defaultCourses;
  });
  const [courses, setCourses] = useState([]);

  const [newCourseName, setNewCourseName] = useState("");
  const [newCourseStandard, setNewCourseStandard] = useState(1);

  useEffect(() => {
    const filtered = allCourses.filter((course) => course.standard === standard);
    setCourses(filtered);
  }, [standard, allCourses]);

  // 🧠 Save courses to both admin and student storage
  useEffect(() => {
    localStorage.setItem("allCourses", JSON.stringify(allCourses));
    localStorage.setItem("studentCourses", JSON.stringify(allCourses)); // sync with student side
  }, [allCourses]);

  const handleBack = () => {
    navigate("/admin-dashboard");
  };

  const handleAddCourse = (e) => {
    e.preventDefault();
    if (!newCourseName.trim()) {
      alert("Please enter a subject name!");
      return;
    }

    const newCourse = {
      id: Date.now(),
      name: newCourseName.trim(),
      standard: parseInt(newCourseStandard),
    };

    const updatedCourses = [...allCourses, newCourse];
    setAllCourses(updatedCourses);
    setNewCourseName("");
    alert("✅ New subject added successfully!");
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      const updated = allCourses.filter((c) => c.id !== id);
      setAllCourses(updated);
    }
  };

  return (
    <div className="courses-container">
      <div className="courses-header">
        <h2>📘 Courses for Standard {standard}</h2>
        <button className="back-btn" onClick={handleBack}>← Back</button>
      </div>

      <div className="standard-select">
        <label>Select Standard: </label>
        <select value={standard} onChange={(e) => setStandard(parseInt(e.target.value))}>
          {[1,2,3,4,5,6,7,8,9,10].map((s) => (
            <option key={s} value={s}>Standard {s}</option>
          ))}
        </select>
      </div>

      <ul className="course-list">
        {courses.length > 0 ? (
          courses.map((course, idx) => (
            <li key={course.id} style={{ animationDelay: `${idx * 0.1}s` }}>
              {course.name}
              <button className="delete-btn" onClick={() => handleDelete(course.id)}>🗑</button>
            </li>
          ))
        ) : (
          <li className="empty">No courses for this standard.</li>
        )}
      </ul>

      <div className="add-course-form">
        <h3>Add New Subject</h3>
        <form onSubmit={handleAddCourse}>
          <input
            type="text"
            placeholder="Enter subject name"
            value={newCourseName}
            onChange={(e) => setNewCourseName(e.target.value)}
          />
          <select
            value={newCourseStandard}
            onChange={(e) => setNewCourseStandard(parseInt(e.target.value))}
          >
            {[1,2,3,4,5,6,7,8,9,10].map((s) => (
              <option key={s} value={s}>Standard {s}</option>
            ))}
          </select>
          <button type="submit">Add Subject</button>
        </form>
      </div>
    </div>
  );
}
