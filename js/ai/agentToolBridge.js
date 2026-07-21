// Used by Agent Mode orchestration loop — Phase 2
import { ExecutionRegistry, ToolSelector } from '../tools/registry.js';
import { ToolExecutor } from '../tools/executor.js';

export async function executeAgentTool(toolId, params) {
  try {
    // 1. Check if it's a TYPE A tool (Executable)
    const execTool = ExecutionRegistry.getTool(toolId);
    if (execTool) {
      const response = await ToolExecutor.execute(toolId, params || {});
      if (!response.success) {
        return {
          success: false,
          toolId,
          kind: "data",
          result: null,
          error: response.error || "Execution failed"
        };
      }
      return {
        success: true,
        toolId,
        kind: "data",
        result: response.data,
        error: null
      };
    }

    // 2. Check if it's a TYPE B (Content) or Utility tool
    const toolMeta = ToolSelector.getToolMetaById(toolId);
    if (toolMeta) {
      if (toolMeta.mode === 'utility') {
        return {
          success: true,
          toolId,
          kind: "ui-trigger",
          result: { toolId, action: "open-utility-panel" },
          error: null
        };
      } else {
        // Content tool
        const userInput = (params && params.input) || "";
        return {
          success: true,
          toolId,
          kind: "content",
          result: {
            systemPromptHint: toolMeta.systemPromptHint || "",
            userInput: userInput
          },
          error: null
        };
      }
    }

    // 3. Unknown tool
    return {
      success: false,
      toolId,
      kind: null,
      result: null,
      error: `Unknown tool: ${toolId}`
    };

  } catch (error) {
    return {
      success: false,
      toolId,
      kind: null,
      result: null,
      error: error.message || "An unexpected error occurred during execution."
    };
  }
}
