
import React, { useState, useRef } from 'react';
import '../styles/FileUpload.css';

export default function FileUpload({ onFilesAdded }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files);
    processFiles(files);
  };

  const processFiles = (files) => {
    files.forEach((file, index) => {
      const fileId = `${file.name}-${Date.now()}-${index}`;
      setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));
      
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          const currentProgress = prev[fileId] || 0;
          if (currentProgress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setUploadProgress(prev => {
                const { [fileId]: removed, ...rest } = prev;
                return rest;
              });
            }, 1000);
            onFilesAdded(file);
            return prev;
          }
          return { ...prev, [fileId]: currentProgress + Math.random() * 30 };
        });
      }, 200);
    });
  };

  return (
    <div className="file-upload-container">
      <div 
        className={`file-upload-zone ${isDragOver ? 'drag-over' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="upload-icon">
          <div className="upload-arrow">↑</div>
        </div>
        <h3>Drop files here or click to upload</h3>
        <p>Supports ANY file type • Maximum 100MB per file</p>
        <div className="upload-stats">
          <span>🔒 End-to-end encrypted</span>
          <span>⚡ Lightning fast</span>
        </div>
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileInput}
        style={{ display: 'none' }}
      />

      {Object.keys(uploadProgress).length > 0 && (
        <div className="upload-progress-container">
          {Object.entries(uploadProgress).map(([fileId, progress]) => (
            <div key={fileId} className="upload-progress-item">
              <div className="progress-info">
                <span className="file-name">{fileId.split('-')[0]}</span>
                <span className="progress-percent">{Math.round(progress)}%</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
