
import React, { useState } from 'react';
import '../styles/Settings.css';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    biometricAuth: true,
    autoLock: true,
    lockTimeout: 5,
    encryptionLevel: 'AES-256',
    backupEnabled: false,
    decoyVault: true,
    theme: 'cyberpunk'
  });

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1>Vault Settings</h1>
        <div className="settings-subtitle">Configure your security preferences</div>
      </div>

      <div className="settings-grid">
        <div className="settings-section">
          <div className="section-header">
            <h3>🔐 Security</h3>
            <p>Advanced security configurations</p>
          </div>
          
          <div className="setting-item">
            <div className="setting-info">
              <label>Biometric Authentication</label>
              <span>Use fingerprint or face recognition</span>
            </div>
            <div className="setting-control">
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={settings.biometricAuth}
                  onChange={(e) => handleSettingChange('biometricAuth', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <label>Auto-Lock Vault</label>
              <span>Automatically lock after inactivity</span>
            </div>
            <div className="setting-control">
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={settings.autoLock}
                  onChange={(e) => handleSettingChange('autoLock', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <label>Lock Timeout</label>
              <span>Minutes before auto-lock</span>
            </div>
            <div className="setting-control">
              <select 
                value={settings.lockTimeout}
                onChange={(e) => handleSettingChange('lockTimeout', parseInt(e.target.value))}
                className="setting-select"
              >
                <option value={1}>1 minute</option>
                <option value={5}>5 minutes</option>
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={60}>1 hour</option>
              </select>
            </div>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <label>Encryption Level</label>
              <span>File encryption strength</span>
            </div>
            <div className="setting-control">
              <select 
                value={settings.encryptionLevel}
                onChange={(e) => handleSettingChange('encryptionLevel', e.target.value)}
                className="setting-select"
              >
                <option value="AES-128">AES-128</option>
                <option value="AES-256">AES-256</option>
                <option value="ChaCha20">ChaCha20</option>
              </select>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <div className="section-header">
            <h3>💾 Backup & Sync</h3>
            <p>Data protection and synchronization</p>
          </div>
          
          <div className="setting-item">
            <div className="setting-info">
              <label>Cloud Backup</label>
              <span>Encrypted backup to cloud storage</span>
            </div>
            <div className="setting-control">
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={settings.backupEnabled}
                  onChange={(e) => handleSettingChange('backupEnabled', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>

          <div className="backup-status">
            <div className="status-indicator">
              <span className="status-dot"></span>
              Last backup: Never
            </div>
            <button className="backup-btn" disabled={!settings.backupEnabled}>
              Backup Now
            </button>
          </div>
        </div>

        <div className="settings-section">
          <div className="section-header">
            <h3>🎭 Privacy</h3>
            <p>Advanced privacy features</p>
          </div>
          
          <div className="setting-item">
            <div className="setting-info">
              <label>Decoy Vault</label>
              <span>Show fake files to unauthorized users</span>
            </div>
            <div className="setting-control">
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={settings.decoyVault}
                  onChange={(e) => handleSettingChange('decoyVault', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <div className="section-header">
            <h3>🎨 Appearance</h3>
            <p>Customize your vault experience</p>
          </div>
          
          <div className="setting-item">
            <div className="setting-info">
              <label>Theme</label>
              <span>Visual style of the vault</span>
            </div>
            <div className="setting-control">
              <select 
                value={settings.theme}
                onChange={(e) => handleSettingChange('theme', e.target.value)}
                className="setting-select"
              >
                <option value="cyberpunk">Cyberpunk</option>
                <option value="dark">Dark Mode</option>
                <option value="light">Light Mode</option>
                <option value="matrix">Matrix Green</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="settings-actions">
        <button className="btn btn-secondary">Reset to Defaults</button>
        <button className="btn btn-primary">Save Changes</button>
      </div>

      <div className="danger-zone">
        <div className="danger-header">
          <h3>⚠️ Danger Zone</h3>
          <p>Irreversible actions</p>
        </div>
        <div className="danger-actions">
          <button className="btn btn-danger">Export Vault Data</button>
          <button className="btn btn-danger">Delete All Data</button>
          <button className="btn btn-danger">Close Account</button>
        </div>
      </div>
    </div>
  );
}
