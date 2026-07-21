// Used by Agent Mode orchestration loop — Phase 2
import { ToolSelector, ExecutionRegistry } from '../tools/registry.js';

export function getAllToolSchemas() {
  return [
    // --- TYPE A: Executable Tools ---
    {
      type: "function",
      function: {
        name: "calculator",
        description: "Perform mathematical calculations safely. Use for arithmetic, percentages, unit math, etc.",
        parameters: {
          type: "object",
          properties: {
            expression: { type: "string", description: "The mathematical expression to evaluate, e.g. '15% of 4500' or '(120+80)*3'" }
          },
          required: ["expression"]
        }
      }
    },
    {
      type: "function",
      function: {
        name: "weather",
        description: "Fetch current weather information for a specific city.",
        parameters: {
          type: "object",
          properties: {
            city: { type: "string", description: "The city to get weather for, e.g. 'London' or 'New York, US'" }
          },
          required: ["city"]
        }
      }
    },
    {
      type: "function",
      function: {
        name: "search",
        description: "Search the internet for real-time information or news.",
        parameters: {
          type: "object",
          properties: {
            query: { type: "string", description: "The search query to look up on the web" }
          },
          required: ["query"]
        }
      }
    },

    // --- TYPE B: Content Tools ---
    {
      type: "function",
      function: {
        name: "ig-caption",
        description: "Generate Instagram captions, hashtags, and reel ideas. Use this when the user needs Instagram content.",
        parameters: {
          type: "object",
          properties: {
            input: { type: "string", description: "The user's request, topic, or content for this tool (e.g. the topic for an Instagram caption, the job description for a cover letter, etc.)" }
          },
          required: ["input"]
        }
      }
    },
    {
      type: "function",
      function: {
        name: "ig-growth",
        description: "Provide Instagram growth strategies and tips tailored to a niche. Use this when the user asks for Instagram growth advice.",
        parameters: {
          type: "object",
          properties: {
            input: { type: "string", description: "The user's request, topic, or content for this tool (e.g. the topic for an Instagram caption, the job description for a cover letter, etc.)" }
          },
          required: ["input"]
        }
      }
    },
    {
      type: "function",
      function: {
        name: "fb-post",
        description: "Write Facebook post copy, ad copy, and engagement hooks. Use this when the user needs content for Facebook.",
        parameters: {
          type: "object",
          properties: {
            input: { type: "string", description: "The user's request, topic, or content for this tool (e.g. the topic for an Instagram caption, the job description for a cover letter, etc.)" }
          },
          required: ["input"]
        }
      }
    },
    {
      type: "function",
      function: {
        name: "yt-meta",
        description: "Generate SEO-optimized YouTube video titles, tags, and descriptions. Use this to optimize YouTube metadata.",
        parameters: {
          type: "object",
          properties: {
            input: { type: "string", description: "The user's request, topic, or content for this tool (e.g. the topic for an Instagram caption, the job description for a cover letter, etc.)" }
          },
          required: ["input"]
        }
      }
    },
    {
      type: "function",
      function: {
        name: "yt-script",
        description: "Write full YouTube video scripts with visual cues and pacing. Use this when the user wants a YouTube script.",
        parameters: {
          type: "object",
          properties: {
            input: { type: "string", description: "The user's request, topic, or content for this tool (e.g. the topic for an Instagram caption, the job description for a cover letter, etc.)" }
          },
          required: ["input"]
        }
      }
    },
    {
      type: "function",
      function: {
        name: "x-thread",
        description: "Write a viral X/Twitter thread or a single engaging tweet. Use this when the user needs Twitter content.",
        parameters: {
          type: "object",
          properties: {
            input: { type: "string", description: "The user's request, topic, or content for this tool (e.g. the topic for an Instagram caption, the job description for a cover letter, etc.)" }
          },
          required: ["input"]
        }
      }
    },
    {
      type: "function",
      function: {
        name: "blog-post",
        description: "Write an SEO-structured blog post with headers and meta descriptions. Use this when the user wants a blog post written.",
        parameters: {
          type: "object",
          properties: {
            input: { type: "string", description: "The user's request, topic, or content for this tool (e.g. the topic for an Instagram caption, the job description for a cover letter, etc.)" }
          },
          required: ["input"]
        }
      }
    },
    {
      type: "function",
      function: {
        name: "page-insights",
        description: "Provide advisory website page insights for speed and SEO based on user description. Use this for quick website analysis.",
        parameters: {
          type: "object",
          properties: {
            input: { type: "string", description: "The user's request, topic, or content for this tool (e.g. the topic for an Instagram caption, the job description for a cover letter, etc.)" }
          },
          required: ["input"]
        }
      }
    },
    {
      type: "function",
      function: {
        name: "full-audit",
        description: "Generate a comprehensive website audit report based on a user-provided description. Use this for in-depth website reviews.",
        parameters: {
          type: "object",
          properties: {
            input: { type: "string", description: "The user's request, topic, or content for this tool (e.g. the topic for an Instagram caption, the job description for a cover letter, etc.)" }
          },
          required: ["input"]
        }
      }
    },
    {
      type: "function",
      function: {
        name: "bug-report",
        description: "Format a structured bug or issue report with reproduction steps and severity. Use this when the user describes a software bug.",
        parameters: {
          type: "object",
          properties: {
            input: { type: "string", description: "The user's request, topic, or content for this tool (e.g. the topic for an Instagram caption, the job description for a cover letter, etc.)" }
          },
          required: ["input"]
        }
      }
    },
    {
      type: "function",
      function: {
        name: "score-meter",
        description: "Provide an estimated advisory performance and SEO score for a website out of 100. Use this to score a website.",
        parameters: {
          type: "object",
          properties: {
            input: { type: "string", description: "The user's request, topic, or content for this tool (e.g. the topic for an Instagram caption, the job description for a cover letter, etc.)" }
          },
          required: ["input"]
        }
      }
    },
    {
      type: "function",
      function: {
        name: "humanize",
        description: "Rewrite AI-generated or stiff text to sound naturally human. Use this to make text more conversational.",
        parameters: {
          type: "object",
          properties: {
            input: { type: "string", description: "The user's request, topic, or content for this tool (e.g. the topic for an Instagram caption, the job description for a cover letter, etc.)" }
          },
          required: ["input"]
        }
      }
    },
    {
      type: "function",
      function: {
        name: "email-write",
        description: "Write professional emails for various purposes (proposals, follow-ups, pitches). Use this for email drafting.",
        parameters: {
          type: "object",
          properties: {
            input: { type: "string", description: "The user's request, topic, or content for this tool (e.g. the topic for an Instagram caption, the job description for a cover letter, etc.)" }
          },
          required: ["input"]
        }
      }
    },
    {
      type: "function",
      function: {
        name: "resume-builder",
        description: "Generate ATS-friendly resume content, achievement bullets, and keywords. Use this when the user needs resume help.",
        parameters: {
          type: "object",
          properties: {
            input: { type: "string", description: "The user's request, topic, or content for this tool (e.g. the topic for an Instagram caption, the job description for a cover letter, etc.)" }
          },
          required: ["input"]
        }
      }
    },
    {
      type: "function",
      function: {
        name: "cover-letter",
        description: "Write a tailored cover letter connecting the user's background to a job description. Use this for cover letter generation.",
        parameters: {
          type: "object",
          properties: {
            input: { type: "string", description: "The user's request, topic, or content for this tool (e.g. the topic for an Instagram caption, the job description for a cover letter, etc.)" }
          },
          required: ["input"]
        }
      }
    },
    {
      type: "function",
      function: {
        name: "citation-gen",
        description: "Generate correctly formatted citations in APA, MLA, Chicago, and Harvard styles. Use this for referencing sources.",
        parameters: {
          type: "object",
          properties: {
            input: { type: "string", description: "The user's request, topic, or content for this tool (e.g. the topic for an Instagram caption, the job description for a cover letter, etc.)" }
          },
          required: ["input"]
        }
      }
    },

    // --- TYPE B: Utility Tools (12 total) ---
    {
      type: "function",
      function: {
        name: "word-counter",
        description: "Opens the Word & Character Counter utility for the user. Call this when the user wants to count words, characters, or reading time — you are only triggering the UI panel, not doing the counting yourself.",
        parameters: { type: "object", properties: {} }
      }
    },
    {
      type: "function",
      function: {
        name: "qr-generator",
        description: "Opens the QR Code Generator utility for the user. Call this when the user wants to convert text or link to QR code — you are only triggering the UI panel, not generating the QR code yourself.",
        parameters: { type: "object", properties: {} }
      }
    },
    {
      type: "function",
      function: {
        name: "password-gen",
        description: "Opens the Password Generator utility for the user. Call this when the user wants strong random passwords — you are only triggering the UI panel, not generating the password yourself.",
        parameters: { type: "object", properties: {} }
      }
    },
    {
      type: "function",
      function: {
        name: "case-converter",
        description: "Opens the Case Converter utility for the user. Call this when the user wants to convert text to UPPER, lower, or Title Case — you are only triggering the UI panel, not converting the text yourself.",
        parameters: { type: "object", properties: {} }
      }
    },
    {
      type: "function",
      function: {
        name: "age-calculator",
        description: "Opens the Age Calculator utility for the user. Call this when the user wants to calculate their exact age from date of birth — you are only triggering the UI panel, not calculating the age yourself.",
        parameters: { type: "object", properties: {} }
      }
    },
    {
      type: "function",
      function: {
        name: "unit-converter",
        description: "Opens the Unit Converter utility for the user. Call this when the user wants to convert length, weight, or temperature — you are only triggering the UI panel, not converting units yourself.",
        parameters: { type: "object", properties: {} }
      }
    },
    {
      type: "function",
      function: {
        name: "image-compressor",
        description: "Opens the Image Compressor utility for the user. Call this when the user wants to shrink JPG, PNG, WebP images — you are only triggering the UI panel, not compressing images yourself.",
        parameters: { type: "object", properties: {} }
      }
    },
    {
      type: "function",
      function: {
        name: "image-to-pdf",
        description: "Opens the Image to PDF utility for the user. Call this when the user wants to combine photos into one PDF — you are only triggering the UI panel, not creating the PDF yourself.",
        parameters: { type: "object", properties: {} }
      }
    },
    {
      type: "function",
      function: {
        name: "pdf-merge",
        description: "Opens the Merge PDF utility for the user. Call this when the user wants to combine multiple PDFs — you are only triggering the UI panel, not merging PDFs yourself.",
        parameters: { type: "object", properties: {} }
      }
    },
    {
      type: "function",
      function: {
        name: "pdf-split",
        description: "Opens the Split PDF utility for the user. Call this when the user wants to extract pages from a PDF — you are only triggering the UI panel, not splitting PDFs yourself.",
        parameters: { type: "object", properties: {} }
      }
    },
    {
      type: "function",
      function: {
        name: "image-converter",
        description: "Opens the Image Format Converter utility for the user. Call this when the user wants to convert between PNG, JPG, WebP — you are only triggering the UI panel, not converting formats yourself.",
        parameters: { type: "object", properties: {} }
      }
    },
    {
      type: "function",
      function: {
        name: "gpa-calc",
        description: "Opens the GPA / Percentage Calculator utility for the user. Call this when the user wants grade calculations — you are only triggering the UI panel, not calculating GPA yourself.",
        parameters: { type: "object", properties: {} }
      }
    }
  ];
}

export function getToolSchemaById(toolId) {
  return getAllToolSchemas().find(schema => schema.function.name === toolId) || null;
}

export function getToolCategoryMap() {
  const map = {};

  // Map execution tools from ExecutionRegistry
  const execTools = ExecutionRegistry.getAllTools();
  for (const t of execTools) {
    map[t.id] = t.category || "utility";
  }

  // Map ToolSelector tools (Content & Utilities)
  for (const cat of ToolSelector.DATA) {
    for (const t of cat.tools) {
      map[t.id] = cat.id;
    }
  }

  return map;
}
