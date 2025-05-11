import React, { useRef, useState } from 'react';
import AWS from 'aws-sdk';
import './HomePage.css';

const REGION = 'us-east-1'; // Your region
const IDENTITY_POOL_ID = 'us-east-1:e0439fb9-a4b7-4e51-aa25-cdfc73afa5c5';
const BUCKET_NAME = 'audio-bucket69';

const getTemporaryCredentials = () => {
  AWS.config.region = REGION;
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: IDENTITY_POOL_ID,
  });

  return new Promise((resolve, reject) => {
    AWS.config.credentials.get((err) => {
      if (err) {
        console.error('Error getting Cognito credentials:', err);
        reject(err);
      } else {
        resolve(AWS.config.credentials);
      }
    });
  });
};

export default function HomePage() {
  const [fileName, setFileName] = useState('');
  const fileInput = useRef(null);

  const uploadToS3 = async (file) => {
    try {
      await getTemporaryCredentials();

      const s3 = new AWS.S3();
      const params = {
        Bucket: BUCKET_NAME,
        Key: file.name,
        Body: file,
        ContentType: file.type,
      };

      const data = await s3.upload(params).promise();
      console.log('Upload successful:', data.Location);
    } catch (err) {
      console.error('Upload error:', err);
    }
  };

  const handleFileSelect = e => {
    const f = e.target.files[0];
    if (f) {
      setFileName(f.name);
      uploadToS3(f);
    }
  };

  const handleDrop = e => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) {
      setFileName(f.name);
      uploadToS3(f);
    }
  };

  const handleDragOver = e => e.preventDefault();

  return (
      <div className="home-container">
        <header className="hero">
          <h1>LectureLift</h1>
          <p>Upload a lecture MP3 or video and get AI-powered summaries & quizzes instantly.</p>
        </header>

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

            <svg className="upload-icon" viewBox="0 0 24 24">
              <path d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1" />
              <path d="M12 12V4m0 0l-3 3m3-3 3 3" />
            </svg>

            <div className="upload-text">
              {fileName ? fileName : 'Drag & drop your file here\nor click to browse'}
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

        <footer className="footer">
          &copy; {new Date().getFullYear()} LectureLift. All rights reserved.
        </footer>
      </div>
  );
}
