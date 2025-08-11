
class FileService {
  constructor() {
    // Support all file types - no restrictions
    this.supportedTypes = ['*/*'];
    this.maxFileSize = 100 * 1024 * 1024; // 100MB
  }

  validateFile(file) {
    const errors = [];
    
    if (!file) {
      errors.push('No file provided');
      return { valid: false, errors };
    }

    if (file.size > this.maxFileSize) {
      errors.push(`File size exceeds ${this.formatFileSize(this.maxFileSize)} limit`);
    }

    if (file.size === 0) {
      errors.push('File is empty');
    }

    // Accept all file types - no type restrictions

    return {
      valid: errors.length === 0,
      errors,
      warnings: this.getFileWarnings(file)
    };
  }

  getFileWarnings(file) {
    const warnings = [];
    
    if (file.size > 50 * 1024 * 1024) { // 50MB
      warnings.push('Large file may take longer to encrypt and upload');
    }

    if (file.type.startsWith('video/') && file.size > 10 * 1024 * 1024) {
      warnings.push('Video files are optimally stored when compressed');
    }

    return warnings;
  }

  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  getFileIcon(file) {
    const type = file.type || '';
    const extension = file.name.split('.').pop().toLowerCase();
    
    // Image files
    if (type.startsWith('image/') || ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp', 'ico', 'tiff'].includes(extension)) return '🖼️';
    
    // Video files
    if (type.startsWith('video/') || ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv', '3gp', 'm4v'].includes(extension)) return '🎬';
    
    // Audio files
    if (type.startsWith('audio/') || ['mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a', 'wma'].includes(extension)) return '🎵';
    
    // Document files
    if (type.includes('pdf') || extension === 'pdf') return '📄';
    if (type.includes('word') || type.includes('doc') || ['doc', 'docx'].includes(extension)) return '📝';
    if (type.includes('excel') || type.includes('sheet') || ['xls', 'xlsx', 'csv'].includes(extension)) return '📊';
    if (type.includes('powerpoint') || type.includes('presentation') || ['ppt', 'pptx'].includes(extension)) return '📋';
    
    // Text files
    if (type.startsWith('text/') || ['txt', 'md', 'log', 'cfg', 'ini', 'conf'].includes(extension)) return '📄';
    
    // Archive files
    if (type.includes('zip') || type.includes('rar') || type.includes('7z') || ['zip', 'rar', '7z', 'tar', 'gz', 'bz2'].includes(extension)) return '🗜️';
    
    // Code files
    if (type.includes('javascript') || ['js', 'jsx', 'ts', 'tsx', 'py', 'java', 'cpp', 'c', 'h', 'css', 'html', 'php', 'rb', 'go', 'rs', 'swift', 'kt'].includes(extension)) return '💻';
    
    // Executable files
    if (['exe', 'msi', 'deb', 'rpm', 'dmg', 'pkg', 'app'].includes(extension)) return '⚙️';
    
    // Database files
    if (['db', 'sqlite', 'sql', 'mdb'].includes(extension)) return '🗃️';
    
    // Font files
    if (['ttf', 'otf', 'woff', 'woff2', 'eot'].includes(extension)) return '🔤';
    
    // 3D/CAD files
    if (['obj', 'fbx', 'dae', 'blend', 'max', 'dwg', 'step'].includes(extension)) return '🎨';
    
    // Backup files
    if (['bak', 'backup', 'old'].includes(extension)) return '💾';
    
    // Default for any other file type
    return '📎';
  }

  async readFileAsArrayBuffer(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error);
      reader.readAsArrayBuffer(file);
    });
  }

  async readFileAsText(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });
  }

  async readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  }

  generateThumbnail(file) {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        resolve(null);
        return;
      }

      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      img.onload = () => {
        const maxSize = 150;
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }

  async processFile(file) {
    const validation = this.validateFile(file);
    if (!validation.valid) {
      throw new Error(validation.errors.join(', '));
    }

    const fileData = {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
      icon: this.getFileIcon(file),
      formattedSize: this.formatFileSize(file.size)
    };

    try {
      fileData.thumbnail = await this.generateThumbnail(file);
    } catch (error) {
      console.warn('Failed to generate thumbnail:', error);
    }

    return fileData;
  }

  createDownloadLink(fileData, fileName) {
    const blob = new Blob([fileData], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setTimeout(() => URL.revokeObjectURL(url), 100);
  }

  async compressFile(file, quality = 0.8) {
    if (!file.type.startsWith('image/')) {
      return file; // Only compress images for now
    }

    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        canvas.toBlob((blob) => {
          resolve(new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now()
          }));
        }, file.type, quality);
      };

      img.src = URL.createObjectURL(file);
    });
  }
}

const fileService = new FileService();
export default fileService;
