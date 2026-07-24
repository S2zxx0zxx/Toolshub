import { aiApi } from '../services/aiApi.js';

export const SeoOptimizer = (() => {

  async function analyzeContent(content, targetKeyword = '') {
    const messages = [
      {
        role: 'system',
        content: `You are an SEO expert. Analyze the given content and provide:
1. **SEO Score** (1-100) with breakdown
2. **Title Analysis** - Is it SEO-friendly?
3. **Meta Description** - Suggestions
4. **Keyword Usage** - Density and placement
5. **Content Structure** - Headers, paragraphs, lists
6. **Readability** - Flesch score estimate
7. **Internal Linking** - Opportunities
8. **Image Optimization** - Alt text suggestions
9. **Technical Issues** - Any SEO problems
10. **Improvement Recommendations** - Top 5 fixes

Be specific and actionable.`
      },
      {
        role: 'user',
        content: `Analyze this content for SEO:\n\n${content}\n\nTarget keyword: ${targetKeyword || 'Not specified'}`
      }
    ];

    try {
      const response = await aiApi.chatCompletionJson(messages);
      return {
        success: true,
        analysis: response.choices?.[0]?.message?.content || '',
        timestamp: Date.now()
      };
    } catch (error) {
      return { error: error.message };
    }
  }

  async function generateMetaTags(content, title = '') {
    const messages = [
      {
        role: 'system',
        content: `Generate optimized meta tags for the given content. Provide:
1. **Title Tag** (under 60 characters)
2. **Meta Description** (under 160 characters)
3. **Keywords** (5-10 relevant keywords)
4. **Open Graph tags** (og:title, og:description, og:type)
5. **Twitter Card tags**
6. **Schema.org markup** (if applicable)

Make them compelling and click-worthy.`
      },
      {
        role: 'user',
        content: `Generate meta tags for:\nTitle: ${title || 'Auto-generate'}\nContent: ${content.substring(0, 500)}`
      }
    ];

    try {
      const response = await aiApi.chatCompletionJson(messages);
      return {
        success: true,
        metaTags: response.choices?.[0]?.message?.content || '',
        timestamp: Date.now()
      };
    } catch (error) {
      return { error: error.message };
    }
  }

  async function suggestKeywords(topic) {
    const messages = [
      {
        role: 'system',
        content: `Research and suggest keywords for the given topic. Provide:
1. **Primary Keywords** (3-5 high-volume)
2. **Long-tail Keywords** (5-10 specific phrases)
3. **LSI Keywords** (5-10 related terms)
4. **Question Keywords** (5-10 people also ask)
5. **Keyword Difficulty** estimate
6. **Search Intent** classification

Group by difficulty: Easy, Medium, Hard`
      },
      {
        role: 'user',
        content: `Suggest keywords for: "${topic}"`
      }
    ];

    try {
      const response = await aiApi.chatCompletionJson(messages);
      return {
        success: true,
        topic,
        keywords: response.choices?.[0]?.message?.content || '',
        timestamp: Date.now()
      };
    } catch (error) {
      return { error: error.message };
    }
  }

  return {
    analyzeContent,
    generateMetaTags,
    suggestKeywords
  };
})();
