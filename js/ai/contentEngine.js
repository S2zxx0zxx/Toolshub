import { aiApi } from '../services/aiApi.js';

export const ContentEngine = (() => {

  async function writeBlogPost(topic, options = {}) {
    const { length = 'medium', tone = 'professional', keywords = [] } = options;
    
    const keywordStr = keywords.length > 0 ? `\nTarget keywords: ${keywords.join(', ')}` : '';
    
    const messages = [
      {
        role: 'system',
        content: `You are an expert blog writer and SEO specialist. Write a complete, engaging blog post.

Requirements:
- SEO-friendly title with primary keyword
- Compelling introduction with hook
- Well-structured content with H2/H3 headers
- Natural keyword integration (don't stuff)
- Engaging, readable paragraphs
- Lists and bullet points where appropriate
- Strong conclusion with CTA
- Meta description under 160 characters

Write in ${tone} tone. Length: ${length}.
Use markdown formatting.`
      },
      {
        role: 'user',
        content: `Write a blog post about: "${topic}"${keywordStr}`
      }
    ];

    try {
      const response = await aiApi.chatCompletionJson(messages);
      return {
        success: true,
        topic,
        content: response.choices?.[0]?.message?.content || '',
        timestamp: Date.now()
      };
    } catch (error) {
      return { error: error.message };
    }
  }

  async function writeSocialContent(topic, platform = 'all') {
    const platformPrompts = {
      instagram: `Write Instagram content including:
- 3 caption variations (emotional, educational, CTA-focused)
- 20-30 relevant hashtags
- Best posting time suggestion
- 3 Reel ideas with hooks`,
      
      twitter: `Write Twitter/X content including:
- Hook tweet (under 280 chars)
- 5-8 tweet thread
- Hashtag suggestions
- Engagement tactics`,
      
      linkedin: `Write LinkedIn content including:
- Professional post with story
- Industry insights
- Engagement question
- 3-5 relevant hashtags`,
      
      youtube: `Write YouTube content including:
- 5 SEO-optimized title options
- Video description
- 25-30 tags
- Thumbnail text suggestions`,
      
      facebook: `Write Facebook content including:
- Engaging post copy
- Call-to-action
- Best posting time
- 3-5 hashtags`,
      
      all: `Write content for ALL major platforms (Instagram, Twitter, LinkedIn, YouTube, Facebook) with platform-specific formatting and best practices.`
    };

    const messages = [
      {
        role: 'system',
        content: `You are a social media content expert. ${platformPrompts[platform] || platformPrompts.all}

Make content engaging, platform-appropriate, and optimized for reach.`
      },
      {
        role: 'user',
        content: `Create social media content about: "${topic}"`
      }
    ];

    try {
      const response = await aiApi.chatCompletionJson(messages);
      return {
        success: true,
        topic,
        platform,
        content: response.choices?.[0]?.message?.content || '',
        timestamp: Date.now()
      };
    } catch (error) {
      return { error: error.message };
    }
  }

  async function writeEmail(type, details) {
    const emailTypes = {
      cold: 'cold outreach email',
      followup: 'follow-up email',
      newsletter: 'newsletter email',
      promotional: 'promotional email',
      thankyou: 'thank you email',
      apology: 'apology email',
      business: 'business proposal email'
    };

    const messages = [
      {
        role: 'system',
        content: `You are an expert email copywriter. Write a professional, effective email.

Requirements:
- Compelling subject line
- Personalized greeting
- Clear, concise body
- Strong call-to-action
- Professional sign-off
- Appropriate tone for the context

Email type: ${emailTypes[type] || 'general email'}`
      },
      {
        role: 'user',
        content: `Write a ${emailTypes[type] || 'email'} with these details:\n${details}`
      }
    ];

    try {
      const response = await aiApi.chatCompletionJson(messages);
      return {
        success: true,
        type,
        content: response.choices?.[0]?.message?.content || '',
        timestamp: Date.now()
      };
    } catch (error) {
      return { error: error.message };
    }
  }

  async function generateAdCopy(product, platform = 'facebook') {
    const messages = [
      {
        role: 'system',
        content: `You are a conversion copywriter. Create high-converting ad copy for ${platform}.

Provide:
- 5 headline variations
- 3 primary text variations
- 3 description variations
- Call-to-action suggestions
- Target audience recommendations

Focus on benefits, not features. Use power words and emotional triggers.`
      },
      {
        role: 'user',
        content: `Create ad copy for: ${product}`
      }
    ];

    try {
      const response = await aiApi.chatCompletionJson(messages);
      return {
        success: true,
        product,
        platform,
        content: response.choices?.[0]?.message?.content || '',
        timestamp: Date.now()
      };
    } catch (error) {
      return { error: error.message };
    }
  }

  return {
    writeBlogPost,
    writeSocialContent,
    writeEmail,
    generateAdCopy
  };
})();
