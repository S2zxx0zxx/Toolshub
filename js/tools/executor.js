import { ToolRegistry } from './registry.js';
import { PermissionLayer } from './permissions.js';

export const ToolExecutor = (() => {

  /**
   * Execute a tool securely and wrap results in standard format
   * @param {string} toolId - The ID of the tool to execute
   * @param {Object} parameters - Parameters to pass to the tool
   * @returns {Promise<Object>} Standard result format
   */
  async function execute(toolId, parameters) {
    const startTime = Date.now();
    
    // 1. Validate tool existence
    const tool = ToolRegistry.getTool(toolId);
    if (!tool) {
      return _buildResult(false, null, `Tool '${toolId}' not found in registry.`, toolId, startTime);
    }

    // 2. Permission Check
    if (!PermissionLayer.canExecute(tool)) {
      return _buildResult(false, null, `Permission denied to execute '${toolId}'.`, toolId, startTime);
    }

    // 3. Validation (Basic existence for now - can be expanded to json schema validation)
    if (tool.inputSchema) {
      for (const requiredKey of tool.inputSchema.required || []) {
        if (parameters[requiredKey] === undefined) {
          return _buildResult(false, null, `Missing required parameter: ${requiredKey}`, toolId, startTime);
        }
      }
    }

    // 4. Safe Execution with Timeout
    try {
      // 15 seconds timeout
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Tool execution timed out after 15 seconds.")), 15000);
      });
      
      // Execute the tool logic alongside the timeout
      const data = await Promise.race([
        tool.execute(parameters),
        timeoutPromise
      ]);
      
      return _buildResult(true, data, null, toolId, startTime, tool.version);
    } catch (err) {
      console.error(`Execution error in tool ${toolId}:`, err);
      // Fallback friendly error
      return _buildResult(false, null, err.message || "Service temporarily unavailable.", toolId, startTime, tool?.version);
    }
  }

  function _buildResult(success, data, error, toolId, startTime, version = "1.0") {
    return {
      success,
      data,
      error,
      metadata: {
        toolId,
        executionTime: Date.now() - startTime,
        version
      }
    };
  }

  return {
    execute
  };
})();
