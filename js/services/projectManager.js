import { LocalSettings } from './localSettings.js';

export const ProjectManager = (() => {
  const STORAGE_KEY = 'toolshub_projects';

  function getAllProjects() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  }

  function getProject(projectId) {
    return getAllProjects().find(p => p.id === projectId) || null;
  }

  function createProject(name, description = '', color = '#a855f7') {
    const project = {
      id: 'proj_' + Date.now().toString(36),
      name: name.trim(),
      description: description.trim(),
      color,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      taskCount: 0,
      noteCount: 0
    };
    
    const projects = getAllProjects();
    projects.push(project);
    saveProjects(projects);
    
    return project;
  }

  function updateProject(projectId, updates) {
    const projects = getAllProjects();
    const index = projects.findIndex(p => p.id === projectId);
    if (index === -1) return null;
    
    projects[index] = { ...projects[index], ...updates, updatedAt: Date.now() };
    saveProjects(projects);
    
    return projects[index];
  }

  function deleteProject(projectId) {
    const projects = getAllProjects();
    const filtered = projects.filter(p => p.id !== projectId);
    saveProjects(filtered);
    
    // Clear active project if it was the deleted one
    if (LocalSettings.getActiveProject() === projectId) {
      LocalSettings.setActiveProject(null);
    }
    
    return true;
  }

  function setActiveProject(projectId) {
    LocalSettings.setActiveProject(projectId);
  }

  function getActiveProject() {
    const projectId = LocalSettings.getActiveProject();
    return projectId ? getProject(projectId) : null;
  }

  function getProjectStats(projectId) {
    const tasks = JSON.parse(localStorage.getItem('toolshub_tasks') || '[]');
    const notes = JSON.parse(localStorage.getItem('toolshub_notes') || '[]');
    
    const projectTasks = tasks.filter(t => t.projectId === projectId);
    const projectNotes = notes.filter(n => n.projectId === projectId);
    
    return {
      totalTasks: projectTasks.length,
      completedTasks: projectTasks.filter(t => t.status === 'done').length,
      pendingTasks: projectTasks.filter(t => t.status !== 'done').length,
      totalNotes: projectNotes.length
    };
  }

  function searchProjects(query) {
    const q = query.toLowerCase();
    return getAllProjects().filter(p => 
      p.name.toLowerCase().includes(q) || 
      (p.description && p.description.toLowerCase().includes(q))
    );
  }

  function saveProjects(projects) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    } catch (e) {
      console.error('Failed to save projects:', e);
    }
  }

  function exportProjects() {
    return JSON.stringify(getAllProjects(), null, 2);
  }

  function importProjects(jsonString) {
    try {
      const projects = JSON.parse(jsonString);
      if (!Array.isArray(projects)) throw new Error('Invalid format');
      saveProjects(projects);
      return true;
    } catch {
      return false;
    }
  }

  return {
    getAllProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject,
    setActiveProject,
    getActiveProject,
    getProjectStats,
    searchProjects,
    exportProjects,
    importProjects
  };
})();
