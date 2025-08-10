import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Encryption service for file encryption/decryption
class EncryptionService {
  async encryptFile(file, encryptionKey) {
    const arrayBuffer = await file.arrayBuffer();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(encryptionKey.padEnd(32, '0').substring(0, 32)),
      { name: 'AES-GCM' },
      false,
      ['encrypt']
    );

    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      arrayBuffer
    );

    const result = new Uint8Array(iv.length + encrypted.byteLength);
    result.set(iv);
    result.set(new Uint8Array(encrypted), iv.length);

    return new Blob([result], { type: file.type });
  }

  async decryptFile(encryptedBlob, encryptionKey, originalType) {
    const arrayBuffer = await encryptedBlob.arrayBuffer();
    const iv = arrayBuffer.slice(0, 12);
    const encrypted = arrayBuffer.slice(12);
    
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(encryptionKey.padEnd(32, '0').substring(0, 32)),
      { name: 'AES-GCM' },
      false,
      ['decrypt']
    );

    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: new Uint8Array(iv) },
      key,
      encrypted
    );

    return new Blob([decrypted], { type: originalType });
  }
}

// Create instance
const encryptionService = new EncryptionService();

class SupabaseService {
  // Upload file to Supabase Storage
  async uploadFile(file, encryptionKey, userId) {
    try {
      // Encrypt the file
      const encryptedData = await encryptionService.encryptFile(file, encryptionKey);
      const fileName = `${Date.now()}_${file.name}`;
      const filePath = `vault-files/${userId}/${fileName}`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('vault-files')
        .upload(filePath, encryptedData, {
        });

      if (uploadError) throw uploadError;

      // Store metadata in database
      const { data: dbData, error: dbError } = await supabase
        .from('files')
        .insert({
          user_id: userId,
          file_name: file.name,
          file_type: file.type,
          file_size: file.size,
          file_path: filePath,
          storage_path: uploadData.path,
          encryption_key: encryptionKey,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (dbError) throw dbError;

      return dbData;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error(`Upload failed: ${error.message}`);
    }
  }

  // Get user's files
  async getUserFiles(userId) {
    try {
      const { data, error } = await supabase
        .from('files')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting files:', error);
      throw new Error(`Failed to get files: ${error.message}`);
    }
  }

  // Download file
  async downloadFile(fileId, userId) {
    try {
      // Get file metadata
      const { data: fileData, error: metaError } = await supabase
        .from('files')
        .select('*')
        .eq('id', fileId)
        .eq('user_id', userId)
        .single();

      if (metaError) throw metaError;

      // Download from storage
      const { data: downloadData, error: downloadError } = await supabase.storage
        .from('vault-files')
        .download(fileData.storage_path);

      if (downloadError) throw downloadError;

      return {
        file: downloadData,
        metadata: fileData
      };
    } catch (error) {
      console.error('Error downloading file:', error);
      throw new Error(`Download failed: ${error.message}`);
    }
  }

  // Delete file
  async deleteFile(fileId, userId) {
    try {
      // Get file metadata
      const { data: fileData, error: metaError } = await supabase
        .from('files')
        .select('*')
        .eq('id', fileId)
        .eq('user_id', userId)
        .single();

      if (metaError) throw metaError;

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('vault-files')
        .remove([fileData.storage_path]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('files')
        .delete()
        .eq('id', fileId)
        .eq('user_id', userId);

      if (dbError) throw dbError;

      return { success: true };
    } catch (error) {
      console.error('Error deleting file:', error);
      throw new Error(`Delete failed: ${error.message}`);
    }
  }

  // Get storage usage
  async getStorageUsage(userId) {
    try {
      const { data, error } = await supabase
        .from('files')
        .select('file_size')
        .eq('user_id', userId);

      if (error) throw error;

      const totalSize = data.reduce((sum, file) => sum + file.file_size, 0);
      return {
        totalSize,
        fileCount: data.length
      };
    } catch (error) {
      console.error('Error getting storage usage:', error);
      throw new Error(`Failed to get storage usage: ${error.message}`);
    }
  }

  // Helper method to convert file to base64
  fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  }

  // Helper method to create download link
  createDownloadLink(blob, fileName) {
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => URL.revokeObjectURL(url), 100);
  }

  // Authentication methods
  async signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) throw error;
    return data;
  }

  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    return data;
  }

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }

  // Listen to auth changes
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
  }
}

// Create and export instance
const supabaseServiceInstance = new SupabaseService();
export default supabaseServiceInstance;