import { aiApi } from '../services/aiApi.js';

export const DevAssistant = (() => {

  async function generateCommitMessage(diff) {
    const messages = [
      {
        role: 'system',
        content: `You are a Git commit message expert. Analyze the code changes and generate a concise, descriptive commit message following conventional commits format.

Format: <type>(<scope>): <description>

Types: feat, fix, docs, style, refactor, test, chore, perf, ci, build

Provide:
1. Subject line (under 72 chars)
2. Body (optional, explain what and why)
3. Footer (optional, breaking changes, issue refs)`
      },
      {
        role: 'user',
        content: `Generate commit message for these changes:\n\n${diff}`
      }
    ];

    try {
      const response = await aiApi.chatCompletionJson(messages);
      return {
        success: true,
        commitMessage: response.choices?.[0]?.message?.content || '',
        timestamp: Date.now()
      };
    } catch (error) {
      return { error: error.message };
    }
  }

  async function generatePRDescription(changes, title = '') {
    const messages = [
      {
        role: 'system',
        content: `Generate a comprehensive Pull Request description. Include:
1. **Summary** - Brief overview of changes
2. **Changes** - List of specific changes
3. **Testing** - How to test these changes
4. **Screenshots** - If UI changes (mention what to capture)
5. **Related Issues** - Link any related issues
6. **Checklist** - Review checklist

Use markdown formatting.`
      },
      {
        role: 'user',
        content: `PR Title: ${title || 'Auto-generate'}\n\nChanges:\n${changes}`
      }
    ];

    try {
      const response = await aiApi.chatCompletionJson(messages);
      return {
        success: true,
        prDescription: response.choices?.[0]?.message?.content || '',
        timestamp: Date.now()
      };
    } catch (error) {
      return { error: error.message };
    }
  }

  async function generateAPIEndpoint(description, framework = 'express') {
    const messages = [
      {
        role: 'system',
        content: `Generate a complete ${framework} API endpoint based on the description. Include:
1. Route definition
2. Request validation
3. Error handling
4. Response formatting
5. Authentication middleware
6. Rate limiting
7. JSDoc comments

Make it production-ready with proper error handling.`
      },
      {
        role: 'user',
        content: `Generate API endpoint: ${description}`
      }
    ];

    try {
      const response = await aiApi.chatCompletionJson(messages);
      const content = response.choices?.[0]?.message?.content || '';
      
      const codeMatch = content.match(/```(?:javascript|typescript|js|ts)?\n([\s\S]*?)```/);
      const code = codeMatch ? codeMatch[1].trim() : content;
      
      return {
        success: true,
        code,
        fullResponse: content,
        timestamp: Date.now()
      };
    } catch (error) {
      return { error: error.message };
    }
  }

  async function generateTestCase(code, framework = 'jest') {
    const messages = [
      {
        role: 'system',
        content: `Generate comprehensive unit tests for the given code using ${framework}. Include:
1. Test cases for all public functions
2. Edge cases and error scenarios
3. Mocking where necessary
4. Clear test descriptions
5. Setup and teardown if needed

Make tests thorough and meaningful.`
      },
      {
        role: 'user',
        content: `Generate ${framework} tests for:\n\n${code}`
      }
    ];

    try {
      const response = await aiApi.chatCompletionJson(messages);
      const content = response.choices?.[0]?.message?.content || '';
      
      const codeMatch = content.match(/```(?:javascript|typescript|js|ts)?\n([\s\S]*?)```/);
      const testCode = codeMatch ? codeMatch[1].trim() : content;
      
      return {
        success: true,
        testCode,
        fullResponse: content,
        timestamp: Date.now()
      };
    } catch (error) {
      return { error: error.message };
    }
  }

  async function generateDocumentation(code, language = 'javascript') {
    const messages = [
      {
        role: 'system',
        content: `Generate comprehensive documentation for the given code. Include:
1. **Overview** - What the code does
2. **API Reference** - Functions/methods with parameters and return values
3. **Usage Examples** - How to use the code
4. **Configuration** - Any configuration options
5. **Dependencies** - Required packages
6. **Notes** - Important considerations

Use markdown formatting with code examples.`
      },
      {
        role: 'user',
        content: `Document this ${language} code:\n\n\`\`\`${language}\n${code}\n\`\`\``
      }
    ];

    try {
      const response = await aiApi.chatCompletionJson(messages);
      return {
        success: true,
        documentation: response.choices?.[0]?.message?.content || '',
        timestamp: Date.now()
      };
    } catch (error) {
      return { error: error.message };
    }
  }

  async function generateDockerfile(appType = 'node') {
    const messages = [
      {
        role: 'system',
        content: `Generate an optimized Dockerfile for a ${appType} application. Include:
1. Multi-stage build
2. Security best practices
3. Layer caching optimization
4. Health checks
5. Environment variables
6. Volume mounts
7. Comments explaining each step

Make it production-ready.`
      },
      {
        role: 'user',
        content: `Generate Dockerfile for ${appType} application`
      }
    ];

    try {
      const response = await aiApi.chatCompletionJson(messages);
      const content = response.choices?.[0]?.message?.content || '';
      
      const codeMatch = content.match(/```dockerfile?\n([\s\S]*?)```/);
      const dockerfile = codeMatch ? codeMatch[1].trim() : content;
      
      return {
        success: true,
        dockerfile,
        fullResponse: content,
        timestamp: Date.now()
      };
    } catch (error) {
      return { error: error.message };
    }
  }

  return {
    generateCommitMessage,
    generatePRDescription,
    generateAPIEndpoint,
    generateTestCase,
    generateDocumentation,
    generateDockerfile
  };
})();
