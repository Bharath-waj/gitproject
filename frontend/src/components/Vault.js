
import React, { useState } from 'react';
import { useVault } from '../contexts/VaultContext';
import '../styles/Vault.css';

function Vault({ encryptionKey }) {
  const { files, loading, downloadFile, deleteFile } = useVault();
  const [deletingFiles, setDeletingFiles] = useState(new Set());

  const handleDownload = async (file) => {
    try {
      await downloadFile(file.id, file.file_name);
    } catch (error) {
      alert(`Download failed: ${error.message}`);
    }
  };

  const handleDelete = async (file) => {
    if (!window.confirm(`Delete ${file.file_name}?`)) return;

    try {
      setDeletingFiles(prev => new Set(prev).add(file.id));
      await deleteFile(file.id);
    } catch (error) {
      alert(`Delete failed: ${error.message}`);
    } finally {
      setDeletingFiles(prev => {
        const newSet = new Set(prev);
        newSet.delete(file.id);
        return newSet;
      });
    }
  };

  const formatFileSize = (bytes) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="vault-loading">
        <div className="loading-spinner"></div>
        <p>Loading your files...</p>
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="vault-empty">
        <p>No files in your vault yet. Upload some files to get started!</p>
      </div>
    );
  }

  return (
    <div className="vault-container">
      <h3>Your Files ({files.length})</h3>
      <div className="files-grid">
        {files.map(file => (
          <div key={file.id} className="file-card">
            <div className="file-info">
              <h4 className="file-name">{file.file_name}</h4>
              <p className="file-details">
                {file.file_type} • {formatFileSize(file.file_size)}
              </p>
              <p className="file-date">
                Uploaded: {formatDate(file.created_at)}
              </p>
            </div>
            <div className="file-actions">
              <button 
                onClick={() => handleDownload(file)}
                className="download-btn"
              >
                Download
              </button>
              <button 
                onClick={() => handleDelete(file)}
                className="delete-btn"
                disabled={deletingFiles.has(file.id)}
              >
                {deletingFiles.has(file.id) ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Vault;
