// Tool schemas for Agent Mode - SIMPLIFIED for better performance
import { ToolSelector, ExecutionRegistry } from '../tools/registry.js';

export function getAllToolSchemas() {
  const schemas = [
    // Core Executable Tools
    {
      type: "function",
      function: {
        name: "calculator",
        description: "Perform mathematical calculations.",
        parameters: {
          type: "object",
          properties: {
            expression: { type: "string", description: "Math expression like '15% of 4500'" }
          },
          required: ["expression"]
        }
      }
    },
    {
      type: "function",
      function: {
        name: "weather",
        description: "Get current weather for a city.",
        parameters: {
          type: "object",
          properties: {
            city: { type: "string", description: "City name" }
          },
          required: ["city"]
        }
      }
    },
    {
      type: "function",
      function: {
        name: "search",
        description: "Search the web for information.",
        parameters: {
          type: "object",
          properties: {
            query: { type: "string", description: "Search query" }
          },
          required: ["query"]
        }
      }
    },

    // Website Generator
    {
      type: "function",
      function: {
        name: "generate_website",
        description: "Generate a complete website from description.",
        parameters: {
          type: "object",
          properties: {
            title: { type: "string", description: "Website title" },
            html_content: { type: "string", description: "Complete HTML code" }
          },
          required: ["title", "html_content"]
        }
      }
    },

    // GitHub Tools
    {
      type: "function",
      function: {
        name: "github_list_files",
        description: "List files in GitHub repository.",
        parameters: {
          type: "object",
          properties: {
            branch: { type: "string", description: "Branch name" }
          }
        }
      }
    },
    {
      type: "function",
      function: {
        name: "github_read_file",
        description: "Read a file from GitHub repository.",
        parameters: {
          type: "object",
          properties: {
            path: { type: "string", description: "File path" }
          },
          required: ["path"]
        }
      }
    },
  ];

  return schemas;
}

export function getToolCategoryMap() {
  const map = {};
  const execTools = ExecutionRegistry.getAllTools();
  for (const t of execTools) {
    map[t.id] = t.category || "utility";
  }
  for (const cat of ToolSelector.DATA) {
    for (const t of cat.tools) {
      map[t.id] = cat.id;
    }
  }
  map['github_list_files'] = 'github';
  map['github_read_file'] = 'github';
  return map;
}
