
import React, { createContext, useContext, useState } from 'react';

const EncryptionContext = createContext();

export function useEncryption() {
  const context = useContext(EncryptionContext);
  if (!context) {
    throw new Error('useEncryption must be used within an EncryptionProvider');
  }
  return context;
}

export function EncryptionProvider({ children }) {
  const [encryptionKey, setEncryptionKey] = useState('');

  const value = {
    encryptionKey,
    setEncryptionKey
  };

  return (
    <EncryptionContext.Provider value={value}>
      {children}
    </EncryptionContext.Provider>
  );
}
