import { ToolSelector } from './registry.js';
import { LocalSettings } from '../services/localSettings.js';

export const ToolIntelligence = (() => {

  function analyzeIntent(userMessage) {
    const msg = userMessage.toLowerCase();
    
    const patterns = {
      weather: /\b(weather|temperature|forecast|rain|sunny|cloudy)\b/i,
      calculator: /\b(calculate|math|compute|sum|add|subtract|multiply|divide|percent|percentage)\b/i,
      search: /\b(search|google|find|look up|what is|who is|when was|latest|recent|news)\b/i,
      social: /\b(instagram|facebook|twitter|youtube|linkedin|tiktok|social media|caption|hashtag|reel|post)\b/i,
      code: /\b(code|program|function|api|debug|error|bug|fix|implement|develop|javascript|python|html|css)\b/i,
      content: /\b(blog|article|write|content|essay|paragraph|email|letter)\b/i,
      file: /\b(image|photo|pdf|file|compress|merge|split|convert|download)\b/i,
      career: /\b(resume|cv|cover letter|job|interview|career|hiring)\b/i,
      design: /\b(website|landing page|ui|design|mockup|prototype|layout)\b/i
    };
    
    const matches = {};
    for (const [tool, pattern] of Object.entries(patterns)) {
      if (pattern.test(msg)) {
        matches[tool] = true;
      }
    }
    
    return matches;
  }

  function suggestTools(userMessage) {
    const intent = analyzeIntent(userMessage);
    const suggestions = [];
    
    if (intent.weather) {
      suggestions.push({ id: 'weather', reason: 'Weather query detected', confidence: 0.9 });
    }
    if (intent.calculator) {
      suggestions.push({ id: 'calculator', reason: 'Math calculation detected', confidence: 0.9 });
    }
    if (intent.search) {
      suggestions.push({ id: 'search', reason: 'Search/research query detected', confidence: 0.85 });
    }
    if (intent.social) {
      const socialTools = ['ig-caption', 'fb-post', 'x-thread', 'yt-meta'];
      socialTools.forEach(t => {
        suggestions.push({ id: t, reason: 'Social media content', confidence: 0.8 });
      });
    }
    if (intent.code) {
      suggestions.push({ id: 'github_read_file', reason: 'Code-related query', confidence: 0.75 });
    }
    if (intent.content) {
      suggestions.push({ id: 'blog-post', reason: 'Content creation', confidence: 0.8 });
    }
    if (intent.file) {
      const fileTools = ['image-compressor', 'pdf-merge', 'image-converter'];
      fileTools.forEach(t => {
        suggestions.push({ id: t, reason: 'File processing', confidence: 0.7 });
      });
    }
    if (intent.career) {
      const careerTools = ['resume-builder', 'cover-letter'];
      careerTools.forEach(t => {
        suggestions.push({ id: t, reason: 'Career tools', confidence: 0.85 });
      });
    }
    if (intent.design) {
      suggestions.push({ id: 'generate_website', reason: 'Website design', confidence: 0.8 });
    }
    
    return suggestions.sort((a, b) => b.confidence - a.confidence);
  }

  function getMostUsedTools() {
    try {
      const usage = JSON.parse(localStorage.getItem('th_tool_usage') || '{}');
      return Object.entries(usage)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([id, count]) => ({ id, count }));
    } catch {
      return [];
    }
  }

  function recordToolUse(toolId) {
    try {
      const usage = JSON.parse(localStorage.getItem('th_tool_usage') || '{}');
      usage[toolId] = (usage[toolId] || 0) + 1;
      localStorage.setItem('th_tool_usage', JSON.stringify(usage));
    } catch {}
  }

  function formatResult(toolId, result) {
    if (!result) return 'No result.';
    
    const formatters = {
      weather: (r) => `**${r.location || 'Location'}:** ${r.temperature ?? '?'}°C, ${r.description || ''}`,
      calculator: (r) => `**${r.original_expression} = ${r.result}**`,
      search: (r) => {
        const answer = r.answer ? `**Summary:** ${r.answer}\n\n` : '';
        const items = (r.results || []).slice(0, 3).map((item, i) => 
          `${i + 1}. [${item.title}](${item.url})`
        ).join('\n');
        return `${answer}${items}`;
      },
      github_list_files: (r) => {
        const files = typeof r === 'string' ? r.split('\n') : [];
        return `**Files (${files.length}):**\n\`\`\`\n${files.slice(0, 30).join('\n')}\n\`\`\``;
      },
      github_read_file: (r) => `\`\`\`\n${typeof r === 'string' ? r : JSON.stringify(r, null, 2)}\n\`\`\``
    };
    
    const formatter = formatters[toolId];
    return formatter ? formatter(result) : (typeof r === 'string' ? r : JSON.stringify(result, null, 2));
  }

  return {
    analyzeIntent,
    suggestTools,
    getMostUsedTools,
    recordToolUse,
    formatResult
  };
})();
