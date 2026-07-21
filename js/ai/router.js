import { ContextManager } from './context.js';
import { IntentEngine } from './intent.js';
import { ToolExecutor } from '../tools/executor.js';
import { aiApi } from '../services/aiApi.js';
import { CloudDB } from '../services/cloudDb.js';
import { LocalSettings } from '../services/localSettings.js';
import { ragService } from '../services/ragService.js';
import { PromptManager } from './prompt.js';

export const AIRouter = (() => {

  /**
   * Main entry point for the AI engine.
   * Process user input, route through tools if needed, and generate final response.
   * 
   * @param {string} text User input
   * @param {Array} chatHistory Previous chat messages array
   * @param {Function} onToolStart Callback to update UI when a tool is executing
   * @returns {AsyncGenerator} The final text stream generator
   */
  async function* processInput(text, chatHistory, onToolStart) {
    
    // Check if query is business/agency specific and populate RAG context
    PromptManager.setRagContext(null);
    // ADVANCED HINGLISH TRIGGER FOR RAG:
    // We use categorized regex patterns to detect if the user's query requires knowledge base retrieval.
    // This handles Hinglish spelling variations, slang, and highly specific domain terms (SEO, Ads, etc).
    // False positives are acceptable, as an extra RAG lookup gracefully contributes nothing extra.
    const RAG_CATEGORIES = {
      // 1. Pricing, Cost & Budget (with Hinglish slang and variations)
      pricing: /\b(price|pricing|cost|costing|rate|rates|charge|charges|fee|fees|kharcha|karcha|kharch|keemat|kimat|qimat|paisa|paise|budget|bajat|quote|quotation|bill|estimate|kitne ka)\b/i,
      
      // 2. Core Offerings & Services
      services: /\b(service|services|offer|offering|offerings|kaam|kya karte|portfolio|kaam karte|banate ho|kya kya hai|kya provide|provide)\b/i,
      
      // 3. Domain Specific Terms (Direct matches from DigiRise Knowledge Base)
      domain: /\b(seo|website|web design|web development|ecommerce|e-commerce|shopify|woocommerce|smm|social media|meta ads|google ads|fb ads|facebook ads|instagram|reels|marketing|branding|brand kit)\b/i,
      
      // 4. Agency Identity, Trust & Process
      identity: /\b(agency|company|digirise|firm|team|roi|guarantee|results|process|refund|shuru|start|onboarding)\b/i,
      
      // 5. Clients & Proof of Work
      proof: /\b(client|clients|customer|customers|case study|case studies|work sample|work samples|kaam dikhao|project dikhao|past work|examples|example|result dikhao)\b/i,
      
      // 6. Packages & Plans
      packages: /\b(package|packages|plan|plans|starter|growth|authority|scale|premium|tier)\b/i
    };

    const needsRag = Object.values(RAG_CATEGORIES).some(pattern => pattern.test(text));
    
    if (needsRag) {
      try {
        const ragResult = await ragService.queryRAG(text);
        if (ragResult && ragResult.results && ragResult.results.length > 0) {
          PromptManager.setRagContext(ragResult.results.map(r => r.text).join('\n---\n'));
        }
      } catch (e) {
        console.warn("RAG fallback error (gracefully bypassed):", e);
      }
    }

    // 1. Build Base Context
    let context = ContextManager.buildContext(chatHistory);

    // 2. Detect Intent
    let intentData = await IntentEngine.detectIntent(text, context);
    
    // 2b. Force web search if toggle is enabled
    if (LocalSettings.getWebSearchEnabled()) {
      intentData = {
        requiresTool: true,
        tool: 'search',
        parameters: { query: text }
      };
    }
    
    let toolResults = [];
    // 3. Tool Routing & Execution
    if (intentData?.requiresTool && intentData?.tool) {
      onToolStart?.(intentData.tool);
      
      const result = await ToolExecutor.execute(intentData.tool, intentData.parameters || {});
      toolResults.push(result);

      // Async log tool execution to Firebase
      CloudDB.logToolExecution(result.metadata).catch(console.error);
    }

    // 4. Re-build context with tool results
    context = ContextManager.buildContext(chatHistory, toolResults);
    
    // Append the current user text as the final message
    context.push({ role: 'user', content: text });

    // 5. Generate Final Response Stream via Groq
    yield* aiApi.chatStream(context);
  }

  return {
    processInput
  };
})();
