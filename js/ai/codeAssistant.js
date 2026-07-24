import { aiApi } from '../services/aiApi.js';

export const CodeAssistant = (() => {

  async function analyzeCode(code, language = null) {
    if (!code || code.trim().length === 0) {
      return { error: 'No code provided.' };
    }

    const detectedLang = language || detectLanguage(code);
    
    const messages = [
      {
        role: 'system',
        content: `You are a code analysis expert. Analyze the following ${detectedLang} code and provide:
1. **Language**: Confirm the programming language
2. **Purpose**: What does this code do?
3. **Quality Score**: Rate 1-10 with explanation
4. **Issues Found**: Any bugs, security vulnerabilities, or problems
5. **Performance**: Any performance concerns
6. **Suggestions**: Improvement recommendations
7. **Complexity**: Rate complexity (Low/Medium/High)
8. **Best Practices**: Does it follow best practices?

Be specific and provide line-by-line analysis where relevant.`
      },
      {
        role: 'user',
        content: `Analyze this ${detectedLang} code:\n\n\`\`\`${detectedLang}\n${code}\n\`\`\``
      }
    ];

    try {
      const response = await aiApi.chatCompletionJson(messages);
      return {
        success: true,
        language: detectedLang,
        analysis: response.choices?.[0]?.message?.content || 'Analysis failed.'
      };
    } catch (error) {
      return { error: error.message };
    }
  }

  async function reviewCode(code, language = null) {
    if (!code || code.trim().length === 0) {
      return { error: 'No code provided.' };
    }

    const detectedLang = language || detectLanguage(code);
    
    const messages = [
      {
        role: 'system',
        content: `You are a senior code reviewer. Review this ${detectedLang} code like a PR review. Provide:
1. **Summary**: One-line summary of what the code does
2. **Critical Issues**: Security vulnerabilities, data leaks, injection risks
3. **Bugs**: Logic errors, race conditions, null references
4. **Performance**: Time/space complexity, optimizations
5. **Maintainability**: Readability, naming, structure
6. **Suggestions**: Specific code improvements with examples
7. **Rating**: Overall rating (Needs Work / Good / Excellent)

Be strict but constructive. Point out specific lines and provide fix suggestions.`
      },
      {
        role: 'user',
        content: `Review this code:\n\n\`\`\`${detectedLang}\n${code}\n\`\`\``
      }
    ];

    try {
      const response = await aiApi.chatCompletionJson(messages);
      return {
        success: true,
        language: detectedLang,
        review: response.choices?.[0]?.message?.content || 'Review failed.'
      };
    } catch (error) {
      return { error: error.message };
    }
  }

  async function explainCode(code, language = null) {
    if (!code || code.trim().length === 0) {
      return { error: 'No code provided.' };
    }

    const detectedLang = language || detectLanguage(code);
    
    const messages = [
      {
        role: 'system',
        content: `You are a coding teacher. Explain this ${detectedLang} code in simple terms. Provide:
1. **Overview**: What does this code do in plain language?
2. **Step-by-Step**: Walk through the code line by line
3. **Key Concepts**: Important programming concepts used
4. **Flow**: How does the data flow through the code?
5. **Use Cases**: When would you use this code?
6. **Learning Points**: What can a beginner learn from this?

Use simple language, analogies, and examples. Make it easy to understand.`
      },
      {
        role: 'user',
        content: `Explain this code:\n\n\`\`\`${detectedLang}\n${code}\n\`\`\``
      }
    ];

    try {
      const response = await aiApi.chatCompletionJson(messages);
      return {
        success: true,
        language: detectedLang,
        explanation: response.choices?.[0]?.message?.content || 'Explanation failed.'
      };
    } catch (error) {
      return { error: error.message };
    }
  }

  async function generateCode(description, language = 'javascript', context = '') {
    if (!description || description.trim().length === 0) {
      return { error: 'No description provided.' };
    }

    const contextBlock = context ? `\n\nAdditional context:\n${context}` : '';
    
    const messages = [
      {
        role: 'system',
        content: `You are an expert ${language} developer. Generate clean, production-ready code based on the description. Provide:
1. Complete, working code
2. Comments explaining key parts
3. Error handling where appropriate
4. Follow best practices for ${language}
5. Include any necessary imports

Write code that is ready to use. No placeholders or TODOs.`
      },
      {
        role: 'user',
        content: `Generate ${language} code for: ${description}${contextBlock}`
      }
    ];

    try {
      const response = await aiApi.chatCompletionJson(messages);
      const content = response.choices?.[0]?.message?.content || '';
      
      // Extract code from markdown code blocks
      const codeMatch = content.match(/```(?:${language})?\n([\s\S]*?)```/);
      const code = codeMatch ? codeMatch[1].trim() : content;
      
      return {
        success: true,
        language,
        code,
        fullResponse: content
      };
    } catch (error) {
      return { error: error.message };
    }
  }

  async function refactorCode(code, language = null, instructions = '') {
    if (!code || code.trim().length === 0) {
      return { error: 'No code provided.' };
    }

    const detectedLang = language || detectLanguage(code);
    const instructionsBlock = instructions ? `\n\nAdditional requirements: ${instructions}` : '';
    
    const messages = [
      {
        role: 'system',
        content: `You are a code refactoring expert. Improve this ${detectedLang} code by:
1. Fixing any bugs or issues
2. Improving readability and structure
3. Optimizing performance
4. Following best practices
5. Adding proper error handling

Provide the refactored code with explanations of changes made.${instructionsBlock}`
      },
      {
        role: 'user',
        content: `Refactor this code:\n\n\`\`\`${detectedLang}\n${code}\n\`\`\``
      }
    ];

    try {
      const response = await aiApi.chatCompletionJson(messages);
      const content = response.choices?.[0]?.message?.content || '';
      
      const codeMatch = content.match(/```(?:${detectedLang})?\n([\s\S]*?)```/);
      const refactoredCode = codeMatch ? codeMatch[1].trim() : content;
      
      return {
        success: true,
        language: detectedLang,
        code: refactoredCode,
        fullResponse: content
      };
    } catch (error) {
      return { error: error.message };
    }
  }

  function detectLanguage(code) {
    const trimmed = code.trim();
    
    if (/^(import|export|const|let|var|function|class|=>)/.test(trimmed)) return 'javascript';
    if (/^(def |class |import |from |if __name__)/.test(trimmed)) return 'python';
    if (/^(public |private |protected |class |interface )/.test(trimmed)) return 'java';
    if (/^(#include|using namespace|int main)/.test(trimmed)) return 'cpp';
    if (/^(func |package |import ")/.test(trimmed)) return 'go';
    if (/^(fn |let |use |match |impl )/.test(trimmed)) return 'rust';
    if (/^(\$|@|php)/.test(trimmed)) return 'php';
    if (/^(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER)/i.test(trimmed)) return 'sql';
    if (/<(div|span|html|body|head|!DOCTYPE)/.test(trimmed)) return 'html';
    if (/^(\.|#|@|\/\*|\*\/)/.test(trimmed)) return 'css';
    if (/^\{/.test(trimmed)) return 'json';
    
    return 'javascript';
  }

  return {
    analyzeCode,
    reviewCode,
    explainCode,
    generateCode,
    refactorCode,
    detectLanguage
  };
})();
