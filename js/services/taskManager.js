import { LocalSettings } from './localSettings.js';

export const TaskManager = (() => {
  const STORAGE_KEY = 'toolshub_tasks';

  function getAllTasks(projectId = null) {
    try {
      const tasks = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      if (projectId) return tasks.filter(t => t.projectId === projectId);
      return tasks;
    } catch {
      return [];
    }
  }

  function getTask(taskId) {
    return getAllTasks().find(t => t.id === taskId) || null;
  }

  function createTask(title, options = {}) {
    const { description = '', projectId = null, priority = 'medium', deadline = null, tags = [] } = options;
    
    const task = {
      id: 'task_' + Date.now().toString(36),
      title: title.trim(),
      description: description.trim(),
      status: 'todo',
      priority,
      projectId: projectId || LocalSettings.getActiveProject(),
      deadline,
      tags,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      completedAt: null
    };
    
    const tasks = getAllTasks();
    tasks.push(task);
    saveTasks(tasks);
    
    return task;
  }

  function updateTask(taskId, updates) {
    const tasks = getAllTasks();
    const index = tasks.findIndex(t => t.id === taskId);
    if (index === -1) return null;
    
    if (updates.status === 'done' && tasks[index].status !== 'done') {
      updates.completedAt = Date.now();
    }
    
    tasks[index] = { ...tasks[index], ...updates, updatedAt: Date.now() };
    saveTasks(tasks);
    
    return tasks[index];
  }

  function deleteTask(taskId) {
    const tasks = getAllTasks();
    const filtered = tasks.filter(t => t.id !== taskId);
    saveTasks(filtered);
    return true;
  }

  function setTaskStatus(taskId, status) {
    return updateTask(taskId, { status });
  }

  function getTasksByStatus(status, projectId = null) {
    return getAllTasks(projectId).filter(t => t.status === status);
  }

  function getTasksByPriority(priority, projectId = null) {
    return getAllTasks(projectId).filter(t => t.priority === priority);
  }

  function getOverdueTasks() {
    const now = Date.now();
    return getAllTasks().filter(t => 
      t.deadline && t.deadline < now && t.status !== 'done'
    );
  }

  function searchTasks(query) {
    const q = query.toLowerCase();
    return getAllTasks().filter(t => 
      t.title.toLowerCase().includes(q) || 
      (t.description && t.description.toLowerCase().includes(q)) ||
      (t.tags && t.tags.some(tag => tag.toLowerCase().includes(q)))
    );
  }

  function getTaskStats(projectId = null) {
    const tasks = getAllTasks(projectId);
    return {
      total: tasks.length,
      todo: tasks.filter(t => t.status === 'todo').length,
      inProgress: tasks.filter(t => t.status === 'in_progress').length,
      done: tasks.filter(t => t.status === 'done').length,
      overdue: getOverdueTasks().length,
      byPriority: {
        high: tasks.filter(t => t.priority === 'high').length,
        medium: tasks.filter(t => t.priority === 'medium').length,
        low: tasks.filter(t => t.priority === 'low').length
      }
    };
  }

  function sortTasks(tasks, sortBy = 'createdAt') {
    return [...tasks].sort((a, b) => {
      if (sortBy === 'priority') {
        const order = { high: 0, medium: 1, low: 2 };
        return order[a.priority] - order[b.priority];
      }
      if (sortBy === 'deadline') {
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return a.deadline - b.deadline;
      }
      if (sortBy === 'status') {
        const order = { todo: 0, in_progress: 1, done: 2 };
        return order[a.status] - order[b.status];
      }
      return b.createdAt - a.createdAt;
    });
  }

  function exportTasks() {
    return JSON.stringify(getAllTasks(), null, 2);
  }

  function saveTasks(tasks) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.error('Failed to save tasks:', e);
    }
  }

  return {
    getAllTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask,
    setTaskStatus,
    getTasksByStatus,
    getTasksByPriority,
    getOverdueTasks,
    searchTasks,
    getTaskStats,
    sortTasks,
    exportTasks
  };
})();
