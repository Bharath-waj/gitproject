import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useVault } from '../contexts/VaultContext';
import FileUpload from '../components/FileUpload';
import Vault from '../components/Vault';
import FileDecryption from '../components/FileDecryption';
import SettingsPage from './SettingsPage';
import '../styles/Vault.css';
import { useNavigate } from 'react-router-dom';
import { useEncryption } from '../contexts/EncryptionContext';

function VaultPage() {
  const { logout, currentUser } = useAuth();
  const { uploadFile, storageUsage } = useVault();
  const { encryptionKey, setEncryptionKey } = useEncryption();
  const navigate = useNavigate();
  const [showKeyPrompt, setShowKeyPrompt] = useState(true);
  const [activeTab, setActiveTab] = useState('vault');

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

  const handleFilesAdded = async (file) => {
    await handleFileUpload(file);
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
        <div className="header-left">
          <button onClick={() => navigate('/LoginPage')} className="back-btn">← Back</button>
          <h1>Oblivian Vault</h1>
        </div>
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

        <div className="tab-buttons">
          <button 
            className={`tab-btn ${activeTab === 'vault' ? 'active' : ''}`}
            onClick={() => setActiveTab('vault')}
          >
            📁 Vault
          </button>
          <button 
            className={`tab-btn ${activeTab === 'upload' ? 'active' : ''}`}
            onClick={() => setActiveTab('upload')}
          >
            📤 Upload
          </button>
          <button 
            className={`tab-btn ${activeTab === 'decrypt' ? 'active' : ''}`}
            onClick={() => setActiveTab('decrypt')}
          >
            🔓 Decrypt
          </button>
          <button 
            className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            ⚙️ Settings
          </button>
        </div>

        {activeTab === 'vault' && (
          <Vault encryptionKey={encryptionKey} />
        )}

        {activeTab === 'upload' && (
          <FileUpload 
            onFilesAdded={handleFilesAdded} 
            encryptionKey={encryptionKey}
          />
        )}

        {activeTab === 'decrypt' && (
          <FileDecryption />
        )}

        {activeTab === 'settings' && (
          <SettingsPage />
        )}
      </div>
    </div>
  );
}

export default VaultPage;