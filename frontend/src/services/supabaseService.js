import { createClient } from '@supabase/supabase-js';
import { EncryptionService } from './encryptionService';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

class SupabaseService {
  // Upload file to Supabase Storage
  async uploadFile(file, encryptionKey, userId) {
    try {
      // Encrypt the file using the imported EncryptionService
      const encryptedData = await EncryptionService.encryptFile(file, encryptionKey);
      const fileName = `${Date.now()}_${file.name}`;
      const filePath = `${userId}/${fileName}`;

      // Create a blob from the encrypted data
      const encryptedBlob = new Blob([encryptedData], { type: 'application/octet-stream' });

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('vault-files')
        .upload(filePath, encryptedBlob);

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        throw uploadError;
      }

      // Store metadata in the database
      const { data: dbData, error: dbError } = await supabase
        .from('files')
        .insert({
          user_id: userId,
          file_name: file.name,
          file_type: file.type,
          file_size: file.size,
          file_path: filePath,
          storage_path: uploadData.path,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (dbError) {
        console.error('Database insert error:', dbError);
        // Clean up the uploaded file if database insert fails
        await supabase.storage.from('vault-files').remove([filePath]);
        throw dbError;
      }

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