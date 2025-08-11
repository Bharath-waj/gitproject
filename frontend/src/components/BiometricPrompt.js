
import React, { useState, useEffect } from 'react';
import '../styles/BiometricPrompt.css';

export default function BiometricPrompt({ isOpen, onClose, onSuccess }) {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setScanResult(null);
    }
  }, [isOpen]);

  const startBiometricScan = async () => {
    setIsScanning(true);
    
    // Simulate biometric scanning process
    setTimeout(() => {
      const success = Math.random() > 0.2; // 80% success rate
      setScanResult(success ? 'success' : 'failed');
      setIsScanning(false);
      
      if (success) {
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1500);
      }
    }, 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="biometric-overlay">
      <div className="biometric-modal">
        <div className="biometric-header">
          <h3>Biometric Authentication</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="biometric-content">
          <div className={`fingerprint-scanner ${isScanning ? 'scanning' : ''} ${scanResult || ''}`}>
            <div className="scanner-ring">
              <div className="scanner-pulse"></div>
            </div>
            <div className="fingerprint-icon">👆</div>
            {isScanning && <div className="scan-line"></div>}
          </div>
          
          <div className="scan-status">
            {!isScanning && !scanResult && (
              <div>
                <p>Place your finger on the scanner</p>
                <button className="scan-btn" onClick={startBiometricScan}>
                  Start Scan
                </button>
              </div>
            )}
            
            {isScanning && (
              <div>
                <p className="scanning-text">Scanning...</p>
                <div className="progress-dots">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
            
            {scanResult === 'success' && (
              <div className="success-message">
                <div className="checkmark">✓</div>
                <p>Authentication Successful!</p>
              </div>
            )}
            
            {scanResult === 'failed' && (
              <div className="error-message">
                <div className="error-mark">×</div>
                <p>Authentication Failed</p>
                <button className="retry-btn" onClick={() => setScanResult(null)}>
                  Try Again
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="biometric-footer">
          <div className="security-indicators">
            <span className="indicator active">🔐 Encrypted</span>
            <span className="indicator active">🛡️ Secure</span>
            <span className="indicator active">⚡ Fast</span>
          </div>
        </div>
      </div>
    </div>
  );
}
