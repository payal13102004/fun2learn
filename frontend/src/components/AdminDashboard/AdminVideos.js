// src/components/AdminDashboard/AdminVideos.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AdminVideos.module.css";

export default function AdminVideos() {
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [newVideo, setNewVideo] = useState({
    title: "",
    subject: "",
    standard: "",
    link: "",
    thumbnail: "",
  });

  // 🧠 Load saved videos from localStorage
  useEffect(() => {
    const savedVideos = JSON.parse(localStorage.getItem("videos") || "[]");
    setVideos(savedVideos);
  }, []);

  // 💾 Auto-save videos to localStorage on update
  useEffect(() => {
    localStorage.setItem("videos", JSON.stringify(videos));
  }, [videos]);

  // ➕ Add new video (with standard)
  const handleAddVideo = (e) => {
    e.preventDefault();
    if (!newVideo.title || !newVideo.link || !newVideo.standard) {
      alert("Please enter title, link, and standard!");
      return;
    }

    const newEntry = {
      id: Date.now(),
      ...newVideo,
    };

    setVideos([...videos, newEntry]);
    setNewVideo({
      title: "",
      subject: "",
      standard: "",
      link: "",
      thumbnail: "",
    });
    alert("✅ Video added successfully!");
  };

  // 🗑 Delete video
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this video?")) {
      const updated = videos.filter((v) => v.id !== id);
      setVideos(updated);
      localStorage.setItem("videos", JSON.stringify(updated)); // 🔄 update for students too
    }
  };

  return (
    <div className={styles.container}>
      <button className={styles.backBtn} onClick={() => navigate("/admin-dashboard")}>
        ← Back
      </button>

      <h2>🎬 Admin Video Management</h2>

      {/* 📋 Add Video Form */}
      <form className={styles.form} onSubmit={handleAddVideo}>
        <input
          type="text"
          placeholder="Enter video title"
          value={newVideo.title}
          onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Enter subject"
          value={newVideo.subject}
          onChange={(e) => setNewVideo({ ...newVideo, subject: e.target.value })}
        />
        <input
          type="number"
          placeholder="Enter Standard (e.g. 5, 6, 7)"
          value={newVideo.standard}
          onChange={(e) => setNewVideo({ ...newVideo, standard: e.target.value })}
          required
        />
        <input
          type="url"
          placeholder="Enter video link (mp4 or YouTube)"
          value={newVideo.link}
          onChange={(e) => setNewVideo({ ...newVideo, link: e.target.value })}
          required
        />
        <input
          type="url"
          placeholder="Enter thumbnail image URL (optional)"
          value={newVideo.thumbnail}
          onChange={(e) => setNewVideo({ ...newVideo, thumbnail: e.target.value })}
        />
        <button type="submit" className={styles.addBtn}>
          ➕ Add Video
        </button>
      </form>

      {/* 📺 Video List */}
      <div className={styles.videoList}>
        {videos.length === 0 ? (
          <p>No videos added yet.</p>
        ) : (
          videos.map((video) => (
            <div key={video.id} className={styles.card}>
              <img
                src={
                  video.thumbnail ||
                  "https://img.freepik.com/free-vector/video-player-interface_23-2147496504.jpg"
                }
                alt={video.title}
                className={styles.thumbnail}
              />
              <div className={styles.details}>
                <h4>{video.title}</h4>
                <small>Subject: {video.subject || "N/A"}</small>
                <small>Standard: {video.standard}</small>
                <a href={video.link} target="_blank" rel="noreferrer">
                  ▶ Watch
                </a>
              </div>
              <button
                className={styles.deleteBtn}
                onClick={() => handleDelete(video.id)}
              >
                🗑 Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
