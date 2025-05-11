import React, { useRef, useState } from 'react';
import './HomePage.css';

export default function HomePage() {
  const [fileName, setFileName] = useState('');
  const fileInput = useRef(null);

  const handleFileSelect = e => {
    const f = e.target.files[0];
    if (f) setFileName(f.name);
  };

  const handleDrop = e => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) setFileName(f.name);
  };

  const handleDragOver = e => e.preventDefault();

  return (
    <div className="home-container">
      {/* Hero */}
      <header className="hero">
        <h1>LectureLift</h1>
        <p>Upload a lecture MP3 or video and get AI-powered summaries & quizzes instantly.</p>
      </header>

      {/* Upload Card */}
      <main className="upload-wrapper">
        <div
          className="upload-card"
          onClick={() => fileInput.current.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <input
            type="file"
            accept="audio/*,video/*"
            ref={fileInput}
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />

          {/* Cloud Upload Icon */}
          <svg
            className="upload-icon"
            viewBox="0 0 24 24"
          >
            <path d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1" />
            <path d="M12 12V4m0 0l-3 3m3-3 3 3" />
          </svg>

          <div className="upload-text">
            {fileName
              ? fileName
              : 'Drag & drop your file here\nor click to browse'}
          </div>

          <button
            type="button"
            className="upload-button"
            onClick={() => fileInput.current.click()}
          >
            {fileName ? 'Change File' : 'Choose File'}
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        &copy; {new Date().getFullYear()} LectureLift. All rights reserved.
      </footer>
    </div>
  );
}
