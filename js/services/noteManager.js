import { LocalSettings } from './localSettings.js';

export const NoteManager = (() => {
  const STORAGE_KEY = 'toolshub_notes';

  function getAllNotes(projectId = null) {
    try {
      const notes = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      if (projectId) return notes.filter(n => n.projectId === projectId);
      return notes.sort((a, b) => b.updatedAt - a.updatedAt);
    } catch {
      return [];
    }
  }

  function getNote(noteId) {
    return getAllNotes().find(n => n.id === noteId) || null;
  }

  function createNote(title, content = '', options = {}) {
    const { projectId = null, tags = [], pinned = false } = options;
    
    const note = {
      id: 'note_' + Date.now().toString(36),
      title: title.trim(),
      content: content.trim(),
      projectId: projectId || LocalSettings.getActiveProject(),
      tags,
      pinned,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    const notes = getAllNotes();
    notes.push(note);
    saveNotes(notes);
    
    return note;
  }

  function updateNote(noteId, updates) {
    const notes = getAllNotes();
    const index = notes.findIndex(n => n.id === noteId);
    if (index === -1) return null;
    
    notes[index] = { ...notes[index], ...updates, updatedAt: Date.now() };
    saveNotes(notes);
    
    return notes[index];
  }

  function deleteNote(noteId) {
    const notes = getAllNotes();
    const filtered = notes.filter(n => n.id !== noteId);
    saveNotes(filtered);
    return true;
  }

  function searchNotes(query) {
    const q = query.toLowerCase();
    return getAllNotes().filter(n => 
      n.title.toLowerCase().includes(q) || 
      n.content.toLowerCase().includes(q) ||
      (n.tags && n.tags.some(tag => tag.toLowerCase().includes(q)))
    );
  }

  function getPinnedNotes(projectId = null) {
    return getAllNotes(projectId).filter(n => n.pinned);
  }

  function addTag(noteId, tag) {
    const note = getNote(noteId);
    if (!note) return null;
    
    const tags = note.tags || [];
    if (!tags.includes(tag)) {
      tags.push(tag);
      return updateNote(noteId, { tags });
    }
    return note;
  }

  function removeTag(noteId, tag) {
    const note = getNote(noteId);
    if (!note) return null;
    
    const tags = (note.tags || []).filter(t => t !== tag);
    return updateNote(noteId, { tags });
  }

  function getAllTags() {
    const notes = getAllNotes();
    const tagSet = new Set();
    notes.forEach(n => (n.tags || []).forEach(t => tagSet.add(t)));
    return Array.from(tagSet).sort();
  }

  function getRecentNotes(limit = 10) {
    return getAllNotes().slice(0, limit);
  }

  function exportNotes() {
    return JSON.stringify(getAllNotes(), null, 2);
  }

  function saveNotes(notes) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    } catch (e) {
      console.error('Failed to save notes:', e);
    }
  }

  return {
    getAllNotes,
    getNote,
    createNote,
    updateNote,
    deleteNote,
    searchNotes,
    getPinnedNotes,
    addTag,
    removeTag,
    getAllTags,
    getRecentNotes,
    exportNotes
  };
})();
