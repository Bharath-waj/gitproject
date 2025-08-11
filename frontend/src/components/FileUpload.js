
import React, { useState, useRef } from 'react';
import '../styles/FileUpload.css';

export default function FileUpload({ onFilesAdded, encryptionKey }) {
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

  const processFiles = async (files) => {
    for (const file of files) {
      const fileId = `${file.name}-${Date.now()}`;
      setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));
      
      try {
        // Start progress simulation
        const interval = setInterval(() => {
          setUploadProgress(prev => {
            const currentProgress = prev[fileId] || 0;
            if (currentProgress >= 90) {
              clearInterval(interval);
              return prev;
            }
            return { ...prev, [fileId]: currentProgress + Math.random() * 20 };
          });
        }, 100);

        // Call the parent callback and wait for completion
        if (onFilesAdded) {
          await onFilesAdded(file);
        }

        // Complete the progress
        clearInterval(interval);
        setUploadProgress(prev => ({ ...prev, [fileId]: 100 }));
        
        // Clear progress after delay
        setTimeout(() => {
          setUploadProgress(prev => {
            const { [fileId]: removed, ...rest } = prev;
            return rest;
          });
        }, 2000);

      } catch (error) {
        console.error('File upload failed:', error);
        alert(`Upload failed: ${error.message}`);
        setUploadProgress(prev => {
          const { [fileId]: removed, ...rest } = prev;
          return rest;
        });
      }
    }
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
