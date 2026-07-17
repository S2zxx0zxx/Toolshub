import { storage } from './firebase.js';
import { Auth } from './auth.js';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-storage.js';

export const StorageService = (() => {
  
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const BLOCKED_EXTENSIONS = ['.exe', '.scr', '.bat', '.cmd', '.sh', '.vbs', '.js', '.ps1'];
  
  function _uid() {
    const user = Auth.getCurrentUser();
    if (!user) throw new Error('Not authenticated');
    return user.uid;
  }

  function _validateFile(file) {
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB.`);
    }

    const name = file.name.toLowerCase();
    for (const ext of BLOCKED_EXTENSIONS) {
      if (name.endsWith(ext)) {
        throw new Error('This file type is not allowed for security reasons.');
      }
    }
  }

  async function uploadFile(file) {
    _validateFile(file);
    const filename = `${Date.now()}_${file.name}`;
    const storageRef = ref(storage, `users/${_uid()}/files/${filename}`);
    
    try {
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);
      return { url, path: snapshot.ref.fullPath, name: file.name };
    } catch (e) {
      console.error('File upload failed:', e);
      throw new Error('Failed to upload file.');
    }
  }

  async function getFileURL(path) {
    try {
      return await getDownloadURL(ref(storage, path));
    } catch (e) {
      console.error('Failed to get file URL:', e);
      throw e;
    }
  }

  async function deleteFile(path) {
    try {
      await deleteObject(ref(storage, path));
    } catch (e) {
      console.error('Failed to delete file:', e);
      throw e;
    }
  }

  return {
    uploadFile,
    getFileURL,
    deleteFile
  };
})();
