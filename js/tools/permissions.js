import { Auth } from '../services/auth.js';

export const PermissionLayer = (() => {
  
  /**
   * Check if the current user has permission to execute the specified tool.
   * @param {Object} tool - The tool schema object from registry
   * @returns {boolean} - true if authorized
   */
  function canExecute(tool) {
    if (!tool) return false;

    // If tool doesn't require any specific permissions, allow
    if (!tool.permissions || tool.permissions.length === 0) {
      return true;
    }

    // Auth validation
    const user = Auth.getCurrentUser();
    if (tool.requiresAuth && !user) {
      return false;
    }

    // Role/Tier validation (assuming basic roles for now)
    // We would normally fetch user.plan or user.role from their Profile document in Firestore
    // For now, we assume standard users have 'basic' permissions.
    const userPermissions = ['basic']; // Default

    // Check if user has ALL required tool permissions
    for (const requiredPerm of tool.permissions) {
      if (!userPermissions.includes(requiredPerm)) {
        return false;
      }
    }

    return true;
  }

  return {
    canExecute
  };
})();
