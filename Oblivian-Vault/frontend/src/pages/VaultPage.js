
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useVault } from '../contexts/VaultContext';
import FileUpload from '../components/FileUpload';
import Vault from '../components/Vault';
import '../styles/Vault.css';

function VaultPage() {
  const { currentUser, logout } = useAuth();
  const { storageUsage } = useVault();
  const [encryptionKey, setEncryptionKey] = useState('');
  const [showKeyPrompt, setShowKeyPrompt] = useState(true);

  const handleLogout = async () => {
    try {
      await logout();
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

        <FileUpload encryptionKey={encryptionKey} />
        <Vault encryptionKey={encryptionKey} />
      </div>
    </div>
  );
}

export default VaultPage;
