import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useVault } from '../contexts/VaultContext';
import FileUpload from '../components/FileUpload';
import Vault from '../components/Vault';
import '../styles/Vault.css';
import { useNavigate } from 'react-router-dom';
import { useEncryption } from '../contexts/EncryptionContext';

function VaultPage() {
  const { logout, currentUser } = useAuth();
  const { uploadFile, storageUsage } = useVault();
  const { encryptionKey, setEncryptionKey } = useEncryption();
  const navigate = useNavigate();
  const [showKeyPrompt, setShowKeyPrompt] = useState(true);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/LoginPage'); // Navigate to login after logout
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleKeySubmit = (e) => {
    e.preventDefault();
    if (encryptionKey.trim()) {
      setShowKeyPrompt(false);
    }
  };

  const handleFileUpload = async (file) => {
    try {
      await uploadFile(file, encryptionKey);
    } catch (error) {
      console.error('Upload failed:', error);
      alert(`Upload failed: ${error.message}`);
    }
  };

  if (showKeyPrompt) {
    return (
      <div className="key-prompt-container">
        <div className="key-prompt-card">
          <h2>Enter Encryption Key</h2>
          <p>This key will be used to encrypt/decrypt your files</p>
          <form onSubmit={handleKeySubmit}>
            <input
              type="password"
              placeholder="Encryption Key"
              value={encryptionKey}
              onChange={(e) => setEncryptionKey(e.target.value)}
            />
            <button type="submit">Access Vault</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="vault-page">
      <header className="vault-header">
        <h1>Oblivian Vault</h1>
        <div className="user-info">
          <span>Welcome, {currentUser?.email}</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      <div className="vault-content">
        <div className="storage-info">
          <p>Files: {storageUsage.fileCount} |
             Storage: {Math.round(storageUsage.totalSize / (1024 * 1024))}MB / 1GB</p>
        </div>

        <FileUpload onFileUpload={handleFileUpload} />
        <Vault encryptionKey={encryptionKey} />
      </div>
    </div>
  );
}

export default VaultPage;