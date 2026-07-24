// SMART ROUTING LAYER - Automatically decides tool + model for every query
import { aiApi } from '../services/aiApi.js';
import { SearchService } from '../services/tools/searchService.js';
import { CalculatorService } from '../services/tools/calculatorService.js';
import { WeatherService } from '../services/tools/weatherService.js';

export const SmartRouter = (() => {

  // TOOL PATTERNS - Match user intent to tools
  const TOOL_PATTERNS = {
    calculator: [
      /\b(calculate|math|compute|sum|add|subtract|multiply|divide|percent|percentage)\b/i,
      /\d+[\s]*[\+\-\*\/\%][\s]*\d+/,
      /\b(how much|what is|solve)\b.*\d/
    ],
    weather: [
      /\b(weather|temperature|forecast|rain|sunny|climate)\b/i,
      /\b(mausam|garmi|thandi|barish)\b/i
    ],
    search: [
      /\b(search|google|find|look up|what is|who is|when was|latest|recent|news)\b/i,
      /\b(batao|pata karo|dhundh)\b/i
    ],
    code_analyze: [
      /\b(analyze|review|check|audit|quality|bug|security)\b.*\b(code|script|function|program)\b/i,
      /\b(code|script|function)\b.*\b(analyze|review|check)\b/i
    ],
    code_generate: [
      /\b(generate|create|write|build|make)\b.*\b(code|script|function|program|api|endpoint)\b/i,
      /\b(code|script|function)\b.*\b(generate|create|write)\b/i
    ],
    code_explain: [
      /\b(explain|describe|walkthrough|understand)\b.*\b(code|script|function|program)\b/i,
      /\b(code|script|function)\b.*\b(explain|understand)\b/i
    ],
    website_generate: [
      /\b(build|create|design|generate|make)\b.*\b(website|webpage|landing page|site|page)\b/i,
      /\b(website|webpage|landing page)\b.*\b(build|create|design)\b/i,
      /\b(html|css|web)\b.*\b(build|create|generate)\b/i
    ],
    blog_post: [
      /\b(write|create|generate)\b.*\b(blog|article|post|content)\b/i,
      /\b(blog|article|post)\b.*\b(write|create|generate)\b/i
    ],
    instagram: [
      /\b(instagram|insta|reel|caption|hashtag)\b/i,
      /\b(ig|reels?)\b.*\b(caption|post|content)\b/i
    ],
    youtube: [
      /\b(youtube|video|script|title|tags|description)\b/i,
      /\b(yt|video)\b.*\b(script|title|content)\b/i
    ],
    twitter: [
      /\b(twitter|tweet|thread|x)\b/i,
      /\b(tweet|thread)\b.*\b(write|create|post)\b/i
    ],
    linkedin: [
      /\b(linkedin|professional|networking)\b/i
    ],
    facebook: [
      /\b(facebook|fb|post|ad)\b/i
    ],
    email: [
      /\b(email|mail|newsletter|outreach)\b/i,
      /\b(email|mail)\b.*\b(write|send|draft)\b/i
    ],
    resume: [
      /\b(resume|cv|curriculum vitae|job application)\b/i
    ],
    cover_letter: [
      /\b(cover letter|application letter)\b/i
    ],
    image_compress: [
      /\b(compress|resize|optimize)\b.*\b(image|photo|picture|img)\b/i
    ],
    image_convert: [
      /\b(convert|transform)\b.*\b(image|photo|picture)\b/i,
      /\b(png|jpg|jpeg|webp)\b.*\b(convert|transform)\b/i
    ],
    pdf_merge: [
      /\b(merge|combine|join)\b.*\b(pdf|document)\b/i
    ],
    pdf_split: [
      /\b(split|extract|separate)\b.*\b(pdf|document|page)\b/i
    ],
    qr_generate: [
      /\b(qr|qrcode|barcode|scan)\b/i
    ],
    password: [
      /\b(password|passphrase|random|string)\b.*\b(generate|create|make)\b/i
    ],
    word_count: [
      /\b(word count|character count|word counter|read time)\b/i
    ],
    case_convert: [
      /\b(uppercase|lowercase|camelcase|snakecase|convert case)\b/i
    ],
    age_calculator: [
      /\b(age|birthday|birth date|dob)\b.*\b(calculate|calculate|find)\b/i
    ],
    unit_converter: [
      /\b(convert|change)\b.*\b(kg|lbs|km|miles|celsius|fahrenheit)\b/i,
      /\b(unit|metric|imperial)\b.*\b(converter|conversion)\b/i
    ],
    github_list: [
      /\b(list|show|display)\b.*\b(files|file list|repository)\b/i
    ],
    github_read: [
      /\b(read|open|show|view)\b.*\b(file|code)\b.*\b(from|in)\b.*\b(github|repo)\b/i
    ],
    github_search: [
      /\b(search|find)\b.*\b(code|file)\b.*\b(in|from)\b.*\b(github|repo)\b/i
    ]
  };

  // MODEL SELECTION - Choose best model for task type
  const MODEL_SELECTION = {
    simple: 'llama-3.1-8b-instant',      // Quick responses
    medium: 'llama-3.3-70b-versatile',    // Standard tasks
    complex: 'llama-3.3-70b-versatile',   // Complex reasoning
    code: 'llama-3.3-70b-versatile',      // Code tasks
    creative: 'llama-3.3-70b-versatile',  // Creative content
    search: 'llama-3.1-8b-instant'        // Search queries
  };

  // Detect which tool to use
  function detectTool(userMessage) {
    const msg = userMessage.toLowerCase();
    
    for (const [tool, patterns] of Object.entries(TOOL_PATTERNS)) {
      for (const pattern of patterns) {
        if (pattern.test(msg)) {
          return tool;
        }
      }
    }
    
    return null; // No tool needed, use general chat
  }

  // Detect task complexity
  function detectComplexity(userMessage) {
    const msg = userMessage.toLowerCase();
    
    // Simple: greetings, yes/no, short questions
    if (msg.length < 20 || /^(hi|hello|hey|ok|yes|no|thanks|bye)$/i.test(msg)) {
      return 'simple';
    }
    
    // Complex: multiple requests, long descriptions
    if (msg.includes(' and ') && msg.includes(' then ')) return 'complex';
    if (msg.length > 200) return 'complex';
    if (/\b(build|create|design|implement|develop)\b/.test(msg)) return 'complex';
    
    // Medium: everything else
    return 'medium';
  }

  // Select best model for task
  function selectModel(taskType, complexity) {
    if (taskType === 'code') return MODEL_SELECTION.code;
    if (taskType === 'search') return MODEL_SELECTION.search;
    if (complexity === 'simple') return MODEL_SELECTION.simple;
    if (complexity === 'complex') return MODEL_SELECTION.complex;
    return MODEL_SELECTION.medium;
  }

  // Execute tool directly (for tools that don't need AI)
  async function executeToolDirect(toolName, params) {
    switch (toolName) {
      case 'calculator':
        return CalculatorService.evaluate(params.expression);
      
      case 'weather':
        return WeatherService.getWeather(params.city);
      
      case 'search':
        return SearchService.searchWeb(params.query);
      
      case 'qr_generate':
        return { type: 'ui-trigger', tool: 'qr-generator', params };
      
      case 'password':
        return { type: 'ui-trigger', tool: 'password-gen', params };
      
      case 'word_count':
        return { type: 'ui-trigger', tool: 'word-counter', params };
      
      case 'case_convert':
        return { type: 'ui-trigger', tool: 'case-converter', params };
      
      case 'age_calculator':
        return { type: 'ui-trigger', tool: 'age-calculator', params };
      
      case 'unit_converter':
        return { type: 'ui-trigger', tool: 'unit-converter', params };
      
      default:
        return null; // Needs AI processing
    }
  }

  // Main routing function
  async function route(userMessage, conversationHistory = []) {
    const tool = detectTool(userMessage);
    const complexity = detectComplexity(userMessage);
    const model = selectModel(tool, complexity);
    
    // If direct tool execution possible
    if (tool) {
      const directResult = await executeToolDirect(tool, extractParams(tool, userMessage));
      if (directResult) {
        return {
          type: 'direct',
          tool,
          model,
          result: directResult
        };
      }
    }
    
    // If AI processing needed
    return {
      type: 'ai',
      tool,
      model,
      complexity,
      message: userMessage
    };
  }

  // Extract parameters from user message
  function extractParams(tool, message) {
    switch (tool) {
      case 'calculator':
        return { expression: message };
      
      case 'weather':
        const cityMatch = message.match(/(?:weather|mausam)\s+(?:in\s+)?(.+)/i);
        return { city: cityMatch ? cityMatch[1].trim() : 'Delhi' };
      
      case 'search':
        const searchMatch = message.match(/(?:search|google|find|look up)\s+(.+)/i);
        return { query: searchMatch ? searchMatch[1].trim() : message };
      
      default:
        return {};
    }
  }

  // Get tool suggestions for user message
  function suggestTools(userMessage) {
    const suggestions = [];
    const msg = userMessage.toLowerCase();
    
    if (/\b(code|script|function|program)\b/.test(msg)) {
      suggestions.push({ tool: 'code_analyze', reason: 'Code-related query' });
      suggestions.push({ tool: 'code_generate', reason: 'Code generation' });
    }
    
    if (/\b(blog|article|post|content)\b/.test(msg)) {
      suggestions.push({ tool: 'blog_post', reason: 'Content creation' });
    }
    
    if (/\b(instagram|insta|reel|caption)\b/.test(msg)) {
      suggestions.push({ tool: 'instagram', reason: 'Social media content' });
    }
    
    if (/\b(youtube|video|script)\b/.test(msg)) {
      suggestions.push({ tool: 'youtube', reason: 'Video content' });
    }
    
    if (/\b(search|find|lookup|what is)\b/.test(msg)) {
      suggestions.push({ tool: 'search', reason: 'Web search needed' });
    }
    
    if (/\b(weather|temperature|forecast)\b/.test(msg)) {
      suggestions.push({ tool: 'weather', reason: 'Weather information' });
    }
    
    if (/\b(calculate|math|compute)\b/.test(msg)) {
      suggestions.push({ tool: 'calculator', reason: 'Math calculation' });
    }
    
    return suggestions;
  }

  return {
    route,
    detectTool,
    detectComplexity,
    selectModel,
    suggestTools,
    executeToolDirect,
    extractParams,
    TOOL_PATTERNS,
    MODEL_SELECTION
  };
})();
