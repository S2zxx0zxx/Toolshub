import { aiApi } from '../services/aiApi.js';
import { SearchService } from '../services/tools/searchService.js';

export const ResearchEngine = (() => {

  async function research(topic, options = {}) {
    const { depth = 'medium', sources = 5, includeCitations = true } = options;
    
    // Step 1: Search for information
    let searchResults = [];
    try {
      const searchResponse = await SearchService.searchWeb(topic);
      searchResults = searchResponse.results || [];
    } catch (e) {
      console.warn('Search failed:', e);
    }
    
    // Step 2: Generate research report using AI
    const sourcesText = searchResults.slice(0, sources).map((r, i) => 
      `[${i + 1}] ${r.title}\n${r.url}\n${r.snippet || ''}`
    ).join('\n\n');
    
    const messages = [
      {
        role: 'system',
        content: `You are a research analyst. Create a comprehensive research report on the given topic.

Use the search results provided as sources. Structure your report with:
1. **Executive Summary** - Brief overview of key findings
2. **Key Findings** - Main points discovered
3. **Detailed Analysis** - In-depth exploration of the topic
4. **Data & Statistics** - Any numerical data found
5. **Trends** - Current trends related to the topic
6. **Expert Opinions** - Notable viewpoints or quotes
7. **Conclusions** - Summary of insights
8. **Recommendations** - Actionable suggestions
9. **Sources** - List all sources used

Write in clear, professional English. Use markdown formatting.`
      },
      {
        role: 'user',
        content: `Research topic: "${topic}"\n\nDepth: ${depth}\n\nSources found:\n${sourcesText || 'No external sources found. Use your knowledge.'}\n\nPlease provide a comprehensive research report.`
      }
    ];

    try {
      const response = await aiApi.chatCompletionJson(messages);
      const report = response.choices?.[0]?.message?.content || '';
      
      return {
        success: true,
        topic,
        report,
        sources: searchResults.slice(0, sources),
        timestamp: Date.now()
      };
    } catch (error) {
      return { error: error.message };
    }
  }

  async function analyzeTrends(topic) {
    const messages = [
      {
        role: 'system',
        content: `You are a trend analyst. Analyze current trends related to the given topic. Provide:
1. **Current State** - Where things stand now
2. **Emerging Trends** - New developments
3. **Market Direction** - Where things are heading
4. **Key Players** - Important entities
5. **Opportunities** - Potential advantages
6. **Challenges** - Potential obstacles
7. **Predictions** - Future outlook

Use data and examples where possible.`
      },
      {
        role: 'user',
        content: `Analyze trends for: "${topic}"`
      }
    ];

    try {
      const response = await aiApi.chatCompletionJson(messages);
      return {
        success: true,
        topic,
        analysis: response.choices?.[0]?.message?.content || '',
        timestamp: Date.now()
      };
    } catch (error) {
      return { error: error.message };
    }
  }

  async function compareOptions(options, criteria) {
    const messages = [
      {
        role: 'system',
        content: `You are a comparison analyst. Compare the given options based on the specified criteria. Provide:
1. **Overview** - Brief description of each option
2. **Comparison Table** - Side-by-side comparison
3. **Pros & Cons** - For each option
4. **Best For** - When to use each option
5. **Recommendation** - Your top pick with reasoning

Use tables and structured formatting.`
      },
      {
        role: 'user',
        content: `Compare these options: ${options.join(', ')}\n\nCriteria: ${criteria || 'General comparison'}`
      }
    ];

    try {
      const response = await aiApi.chatCompletionJson(messages);
      return {
        success: true,
        options,
        comparison: response.choices?.[0]?.message?.content || '',
        timestamp: Date.now()
      };
    } catch (error) {
      return { error: error.message };
    }
  }

  async function factCheck(claims) {
    const messages = [
      {
        role: 'system',
        content: `You are a fact-checker. Analyze the given claims and assess their accuracy. For each claim provide:
1. **Claim** - The statement being checked
2. **Verdict** - True/False/Partially True/Uncertain
3. **Confidence** - How confident you are (High/Medium/Low)
4. **Evidence** - Supporting or contradicting information
5. **Source** - Where the information comes from

Be objective and cite sources where possible.`
      },
      {
        role: 'user',
        content: `Fact-check these claims:\n${claims.map((c, i) => `${i + 1}. ${c}`).join('\n')}`
      }
    ];

    try {
      const response = await aiApi.chatCompletionJson(messages);
      return {
        success: true,
        claims,
        analysis: response.choices?.[0]?.message?.content || '',
        timestamp: Date.now()
      };
    } catch (error) {
      return { error: error.message };
    }
  }

  return {
    research,
    analyzeTrends,
    compareOptions,
    factCheck
  };
})();
