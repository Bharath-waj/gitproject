
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import supabaseService from '../services/supabaseService';

const VaultContext = createContext();

export function useVault() {
  return useContext(VaultContext);
}

export function VaultProvider({ children }) {
  const { currentUser, isAuthenticated } = useAuth();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [storageUsage, setStorageUsage] = useState({ totalSize: 0, fileCount: 0 });
  const [uploadProgress, setUploadProgress] = useState({});

  // Load user files
  const loadFiles = useCallback(async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      const userFiles = await supabaseService.getUserFiles(currentUser.id);
      setFiles(userFiles || []);
    } catch (error) {
      console.error('Error loading files:', error);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  // Load storage usage
  const loadStorageUsage = useCallback(async () => {
    if (!currentUser) return;

    try {
      const usage = await supabaseService.getStorageUsage(currentUser.id);
      setStorageUsage(usage);
    } catch (error) {
      console.error('Error loading storage usage:', error);
    }
  }, [currentUser]);

  // Upload file
  const uploadFile = async (file, encryptionKey) => {
    if (!currentUser) throw new Error('User not authenticated');

    try {
      setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));
      
      const uploadedFile = await supabaseService.uploadFile(
        file, 
        encryptionKey, 
        currentUser.id
      );
      
      setFiles(prev => [uploadedFile, ...prev]);
      setUploadProgress(prev => ({ ...prev, [file.name]: 100 }));
      
      // Refresh storage usage
      await loadStorageUsage();
      
      // Clear progress after delay
      setTimeout(() => {
        setUploadProgress(prev => {
          const newProgress = { ...prev };
          delete newProgress[file.name];
          return newProgress;
        });
      }, 2000);

      return uploadedFile;
    } catch (error) {
      setUploadProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[file.name];
        return newProgress;
      });
      throw error;
    }
  };

  // Download file
  const downloadFile = async (fileId, fileName) => {
    if (!currentUser) throw new Error('User not authenticated');

    try {
      const { file: blob, metadata } = await supabaseService.downloadFile(
        fileId, 
        currentUser.id
      );
      
      supabaseService.createDownloadLink(blob, fileName || metadata.file_name);
      return true;
    } catch (error) {
      console.error('Error downloading file:', error);
      throw error;
    }
  };

  // Delete file
  const deleteFile = async (fileId) => {
    if (!currentUser) throw new Error('User not authenticated');

    try {
      await supabaseService.deleteFile(fileId, currentUser.id);
      setFiles(prev => prev.filter(file => file.id !== fileId));
      await loadStorageUsage();
      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  };

  // Load data when user changes
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      loadFiles();
      loadStorageUsage();
    } else {
      setFiles([]);
      setStorageUsage({ totalSize: 0, fileCount: 0 });
    }
  }, [isAuthenticated, currentUser, loadFiles, loadStorageUsage]);

  const value = {
    files,
    loading,
    storageUsage,
    uploadProgress,
    uploadFile,
    downloadFile,
    deleteFile,
    refreshFiles: loadFiles,
    refreshStorageUsage: loadStorageUsage
  };

  return (
    <VaultContext.Provider value={value}>
      {children}
    </VaultContext.Provider>
  );
}
