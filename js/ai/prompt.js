import { ToolSelector } from '../tools/registry.js';

export const PromptManager = (() => {
  const DEFAULT_SYSTEM_PROMPT = "You are Toolshub AI, an intelligent assistant that helps users discover, understand and use AI tools.";

  function getSystemPrompt() {
    let prompt = DEFAULT_SYSTEM_PROMPT;
    
    // Dynamically add context about the currently active tool
    if (typeof ToolSelector !== 'undefined') {
      const activeToolId = ToolSelector.getActiveTool();
      if (activeToolId) {
        const toolData = ToolSelector.findTool(activeToolId);
        if (toolData && toolData.tool) {
          const t = toolData.tool;
          prompt += `\n\nCRITICAL CONTEXT: The user is currently using the "${t.title}" tool. `;
          if (t.sub) {
            prompt += `The purpose of this tool is: ${t.sub}. `;
          }
          if (t.systemPromptHint) {
            prompt += `\nInstructions for this tool: ${t.systemPromptHint}`;
          } else {
            prompt += `Provide highly accurate, professional, and tailored output specifically for this task. Do not offer general chat unless asked. Deliver the final result directly.`;
          }
        }
      }
    }
    
    return prompt;
  }

  return {
    getSystemPrompt
  };
})();
