// CODE MODE - AI-Powered Code Editor
import { aiApi } from '../../services/aiApi.js';

export const CodeMode = (() => {
  let editor = null;
  let fileExplorer = null;
  let terminal = null;
  let currentFile = null;
  let files = {};

  function init() {
    initFileExplorer();
    initEditor();
    initTerminal();
    initAIAssistant();
    initKeyboardShortcuts();
  }

  // FILE EXPLORER
  function initFileExplorer() {
    const explorer = document.getElementById('exclusiveFileExplorer');
    if (!explorer) return;
    
    // Default project structure
    files = {
      'index.html': '<!DOCTYPE html>\n<html>\n<head>\n  <title>My Project</title>\n  <link rel="stylesheet" href="style.css">\n</head>\n<body>\n  <h1>Hello World!</h1>\n  <script src="app.js"><\/script>\n</body>\n</html>',
      'style.css': 'body {\n  font-family: sans-serif;\n  margin: 0;\n  padding: 20px;\n  background: #f5f5f5;\n}',
      'app.js': 'console.log("Hello from ToolsHub!");\n\ndocument.querySelector("h1").addEventListener("click", () => {\n  alert("Clicked!");\n});'
    };
    
    renderFileExplorer();
  }

  function renderFileExplorer() {
    const explorer = document.getElementById('exclusiveFileExplorer');
    if (!explorer) return;
    
    explorer.innerHTML = `
      <div class="file-explorer-header">
        <span>Explorer</span>
        <button id="newFileBtn" title="New File">+</button>
      </div>
      <div class="file-tree">
        ${Object.keys(files).map(name => `
          <div class="file-item ${name === currentFile ? 'active' : ''}" data-file="${name}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
            ${name}
          </div>
        `).join('')}
      </div>
    `;
    
    // Add click handlers
    explorer.querySelectorAll('.file-item').forEach(item => {
      item.addEventListener('click', () => openFile(item.dataset.file));
    });
    
    // New file button
    document.getElementById('newFileBtn')?.addEventListener('click', createNewFile);
  }

  function openFile(fileName) {
    currentFile = fileName;
    renderFileExplorer();
    
    if (editor && files[fileName] !== undefined) {
      editor.setValue(files[fileName]);
      updateLanguage(fileName);
    }
  }

  function createNewFile() {
    const name = prompt('Enter file name:');
    if (name && !files[name]) {
      files[name] = '';
      openFile(name);
    }
  }

  // CODE EDITOR
  function initEditor() {
    const container = document.getElementById('exclusiveCodeEditor');
    if (!container) return;
    
    // Wait for Monaco to load
    const checkMonaco = setInterval(() => {
      if (window.monaco) {
        clearInterval(checkMonaco);
        createEditor();
      }
    }, 100);
  }

  function createEditor() {
    const container = document.getElementById('exclusiveCodeEditor');
    if (!container || !window.monaco) return;
    
    editor = monaco.editor.create(container, {
      value: files['index.html'] || '',
      language: 'html',
      theme: 'vs-dark',
      minimap: { enabled: true },
      fontSize: 14,
      lineNumbers: 'on',
      roundedSelection: false,
      scrollBeyondLastLine: false,
      automaticLayout: true,
      tabSize: 2,
      wordWrap: 'on'
    });
    
    // Save on change
    editor.onDidChangeModelContent(() => {
      if (currentFile && files[currentFile] !== undefined) {
        files[currentFile] = editor.getValue();
      }
    });
  }

  function updateLanguage(fileName) {
    if (!editor || !window.monaco) return;
    
    const ext = fileName.split('.').pop();
    const langMap = {
      'js': 'javascript',
      'ts': 'typescript',
      'html': 'html',
      'css': 'css',
      'json': 'json',
      'md': 'markdown',
      'py': 'python',
      'java': 'java',
      'cpp': 'cpp',
      'c': 'c',
      'go': 'go',
      'rs': 'rust',
      'php': 'php',
      'rb': 'ruby'
    };
    
    const lang = langMap[ext] || 'plaintext';
    monaco.editor.setModelLanguage(editor.getModel(), lang);
  }

  // TERMINAL
  function initTerminal() {
    const terminalEl = document.getElementById('exclusiveTerminal');
    if (!terminalEl) return;
    
    terminalEl.innerHTML = `
      <div class="terminal-header">
        <span>Terminal</span>
        <button id="clearTerminalBtn" title="Clear">🗑️</button>
      </div>
      <div class="terminal-output">
        <div class="terminal-line">Welcome to ToolsHub Terminal</div>
        <div class="terminal-line">Type 'help' for available commands</div>
      </div>
      <div class="terminal-input-line">
        <span class="terminal-prompt">$</span>
        <input type="text" id="terminalInput" class="terminal-input" placeholder="Enter command...">
      </div>
    `;
    
    const input = document.getElementById('terminalInput');
    const output = terminalEl.querySelector('.terminal-output');
    
    input?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const cmd = input.value.trim();
        if (cmd) {
          executeCommand(cmd, output);
          input.value = '';
        }
      }
    });
    
    document.getElementById('clearTerminalBtn')?.addEventListener('click', () => {
      output.innerHTML = '';
    });
  }

  function executeCommand(cmd, output) {
    // Add command to output
    output.innerHTML += `<div class="terminal-line"><span class="terminal-prompt">$</span> ${cmd}</div>`;
    
    // Process command
    let result = '';
    const parts = cmd.split(' ');
    
    switch (parts[0]) {
      case 'help':
        result = `Available commands:
  help - Show this help
  ls - List files
  cat <file> - Show file content
  echo <text> - Print text
  clear - Clear terminal
  run <file> - Execute file (simulated)
  ai <prompt> - Ask AI assistant`;
        break;
      
      case 'ls':
        result = Object.keys(files).join('\n');
        break;
      
      case 'cat':
        if (parts[1] && files[parts[1]]) {
          result = files[parts[1]];
        } else {
          result = `cat: ${parts[1]}: No such file`;
        }
        break;
      
      case 'echo':
        result = parts.slice(1).join(' ');
        break;
      
      case 'clear':
        output.innerHTML = '';
        return;
      
      case 'run':
        result = `[Running ${parts[1]}...]\nExecution simulated in browser environment.`;
        break;
      
      case 'ai':
        const prompt = parts.slice(1).join(' ');
        result = `[AI] Processing: "${prompt}"...\nAI response will appear here.`;
        break;
      
      default:
        result = `Command not found: ${parts[0]}`;
    }
    
    if (result) {
      output.innerHTML += `<div class="terminal-line">${result}</div>`;
    }
    
    // Scroll to bottom
    output.scrollTop = output.scrollHeight;
  }

  // AI ASSISTANT
  function initAIAssistant() {
    const aiPanel = document.getElementById('exclusiveAIPanel');
    if (!aiPanel) return;
    
    aiPanel.innerHTML = `
      <div class="ai-panel-header">
        <span>AI Assistant</span>
      </div>
      <div class="ai-panel-content">
        <div class="ai-suggestion" data-action="explain">📝 Explain Code</div>
        <div class="ai-suggestion" data-action="review">🔍 Review Code</div>
        <div class="ai-suggestion" data-action="fix">🐛 Fix Bugs</div>
        <div class="ai-suggestion" data-action="optimize">⚡ Optimize</div>
        <div class="ai-suggestion" data-action="test">🧪 Generate Tests</div>
        <div class="ai-suggestion" data-action="docs">📚 Generate Docs</div>
      </div>
      <div class="ai-panel-input">
        <input type="text" id="aiPromptInput" placeholder="Ask AI anything...">
        <button id="aiSendBtn">Send</button>
      </div>
    `;
    
    // Suggestion clicks
    aiPanel.querySelectorAll('.ai-suggestion').forEach(s => {
      s.addEventListener('click', () => handleAISuggestion(s.dataset.action));
    });
    
    // Send button
    document.getElementById('aiSendBtn')?.addEventListener('click', sendAIPrompt);
  }

  async function handleAISuggestion(action) {
    const code = editor?.getValue() || '';
    if (!code) {
      alert('No code to analyze');
      return;
    }
    
    const prompts = {
      explain: `Explain this code step by step:\n\n${code}`,
      review: `Review this code for bugs, security issues, and improvements:\n\n${code}`,
      fix: `Find and fix any bugs in this code:\n\n${code}`,
      optimize: `Suggest performance optimizations for this code:\n\n${code}`,
      test: `Generate unit tests for this code:\n\n${code}`,
      docs: `Generate documentation for this code:\n\n${code}`
    };
    
    await getAIResponse(prompts[action]);
  }

  async function sendAIPrompt() {
    const input = document.getElementById('aiPromptInput');
    const code = editor?.getValue() || '';
    const prompt = input?.value || '';
    
    if (!prompt) return;
    
    await getAIResponse(`${prompt}\n\nCurrent code:\n${code}`);
    input.value = '';
  }

  async function getAIResponse(prompt) {
    const output = document.querySelector('.ai-panel-content');
    if (!output) return;
    
    output.innerHTML += `<div class="ai-message user">${prompt.substring(0, 100)}...</div>`;
    
    try {
      const messages = [
        { role: 'system', content: 'You are a coding assistant. Provide clear, concise code help.' },
        { role: 'user', content: prompt }
      ];
      
      const response = await aiApi.chatCompletionJson(messages);
      const content = response.choices?.[0]?.message?.content || 'No response';
      
      output.innerHTML += `<div class="ai-message assistant">${content}</div>`;
      output.scrollTop = output.scrollHeight;
    } catch (error) {
      output.innerHTML += `<div class="ai-message error">Error: ${error.message}</div>`;
    }
  }

  // KEYBOARD SHORTCUTS
  function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Ctrl+S - Save
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        saveCurrentFile();
      }
      
      // Ctrl+N - New File
      if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        createNewFile();
      }
      
      // Ctrl+` - Toggle Terminal
      if (e.ctrlKey && e.key === '`') {
        e.preventDefault();
        toggleTerminal();
      }
    });
  }

  function saveCurrentFile() {
    if (currentFile && files[currentFile] !== undefined) {
      files[currentFile] = editor?.getValue() || '';
      console.log(`[CodeMode] Saved ${currentFile}`);
    }
  }

  function toggleTerminal() {
    const terminal = document.getElementById('exclusiveTerminal');
    if (terminal) {
      terminal.style.display = terminal.style.display === 'none' ? 'flex' : 'none';
    }
  }

  // PUBLIC API
  function getFiles() {
    return { ...files };
  }

  function getFileContent(fileName) {
    return files[fileName] || null;
  }

  function setFileContent(fileName, content) {
    files[fileName] = content;
    if (fileName === currentFile && editor) {
      editor.setValue(content);
    }
  }

  return {
    init,
    getFiles,
    getFileContent,
    setFileContent,
    openFile,
    createNewFile
  };
})();
