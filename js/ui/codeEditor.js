export const CodeEditor = (() => {

  const LANG_COLORS = {
    javascript: '#f7df1e',
    python: '#3776ab',
    java: '#ed8b00',
    cpp: '#00599c',
    go: '#00add8',
    rust: '#dea584',
    php: '#777bb4',
    sql: '#e38c00',
    html: '#e34c26',
    css: '#563d7c',
    json: '#292929',
    typescript: '#3178c6',
    ruby: '#cc342d',
    swift: '#fa7343',
    kotlin: '#7f52ff'
  };

  function createCodeBlock(code, language = 'javascript', options = {}) {
    const { showLineNumbers = true, showCopy = true, title = null, maxHeight = '400px' } = options;
    
    const langColor = LANG_COLORS[language] || '#666';
    const lines = code.split('\n');
    
    let lineNumbersHtml = '';
    if (showLineNumbers) {
      lineNumbersHtml = `<div class="code-line-numbers">${lines.map((_, i) => `<span>${i + 1}</span>`).join('')}</div>`;
    }
    
    const escapedCode = escapeHtml(code);
    
    return `
      <div class="code-block" style="position:relative; background:#1a1a2e; border-radius:8px; overflow:hidden; margin:12px 0; border:1px solid #333;">
        <div style="display:flex; justify-content:space-between; align-items:center; padding:8px 12px; background:#16162a; border-bottom:1px solid #333;">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="width:12px; height:12px; border-radius:50%; background:${langColor};"></span>
            <span style="color:#aaa; font-size:12px; font-family:monospace;">${language.toUpperCase()}</span>
            ${title ? `<span style="color:#666; font-size:11px;">| ${escapeHtml(title)}</span>` : ''}
          </div>
          ${showCopy ? `
            <button onclick="CodeEditor.copy(this, '${escapeHtml(code).replace(/'/g, "\\'")}')" style="background:#333; border:none; color:#aaa; padding:4px 8px; border-radius:4px; cursor:pointer; font-size:11px;">Copy</button>
          ` : ''}
        </div>
        <div style="display:flex; overflow-x:auto; max-height:${maxHeight}; overflow-y:auto;">
          ${lineNumbersHtml}
          <pre style="margin:0; padding:12px; overflow-x:auto; flex:1;"><code style="color:#e4e4e4; font-family:'Fira Code', 'Consolas', monospace; font-size:13px; line-height:1.5;">${escapedCode}</code></pre>
        </div>
      </div>
    `;
  }

  function createDiffBlock(oldCode, newCode, language = 'javascript') {
    const oldLines = oldCode.split('\n');
    const newLines = newCode.split('\n');
    
    let diffHtml = '';
    const maxLines = Math.max(oldLines.length, newLines.length);
    
    for (let i = 0; i < maxLines; i++) {
      const oldLine = oldLines[i] || '';
      const newLine = newLines[i] || '';
      
      if (oldLine === newLine) {
        diffHtml += `<div style="display:flex;"><span style="width:40px; text-align:right; color:#666; padding-right:8px;">${i + 1}</span><span style="flex:1;">${escapeHtml(newLine)}</span></div>`;
      } else if (oldLine && !newLine) {
        diffHtml += `<div style="display:flex; background:#3d1f1f;"><span style="width:40px; text-align:right; color:#f66; padding-right:8px;">${i + 1}</span><span style="flex:1; color:#f88;">-${escapeHtml(oldLine)}</span></div>`;
      } else if (!oldLine && newLine) {
        diffHtml += `<div style="display:flex; background:#1f3d1f;"><span style="width:40px; text-align:right; color:#6f6; padding-right:8px;">${i + 1}</span><span style="flex:1; color:#8f8;">+${escapeHtml(newLine)}</span></div>`;
      } else {
        diffHtml += `<div style="display:flex; background:#3d3d1f;"><span style="width:40px; text-align:right; color:#ff6; padding-right:8px;">${i + 1}</span><span style="flex:1; color:#ff8;">~${escapeHtml(newLine)}</span></div>`;
      }
    }
    
    return `
      <div class="code-diff" style="background:#1a1a2e; border-radius:8px; overflow:hidden; margin:12px 0; border:1px solid #333;">
        <div style="padding:8px 12px; background:#16162a; border-bottom:1px solid #333; display:flex; gap:16px;">
          <span style="color:#f66; font-size:12px;">- Removed</span>
          <span style="color:#6f6; font-size:12px;">+ Added</span>
          <span style="color:#ff6; font-size:12px;">~ Modified</span>
        </div>
        <pre style="margin:0; padding:12px; overflow-x:auto; font-family:'Fira Code', monospace; font-size:13px; line-height:1.5;">${diffHtml}</pre>
      </div>
    `;
  }

  function createCodeWithHighlight(code, language = 'javascript') {
    const highlighted = highlightSyntax(code, language);
    return `<code class="syntax-highlighted" style="font-family:'Fira Code', monospace;">${highlighted}</code>`;
  }

  function highlightSyntax(code, language) {
    let escaped = escapeHtml(code);
    
    // Keywords by language
    const keywords = {
      javascript: ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue', 'class', 'extends', 'new', 'this', 'import', 'export', 'from', 'default', 'async', 'await', 'try', 'catch', 'throw', 'finally', 'typeof', 'instanceof', 'null', 'undefined', 'true', 'false'],
      python: ['def', 'class', 'import', 'from', 'if', 'elif', 'else', 'for', 'while', 'return', 'yield', 'try', 'except', 'finally', 'raise', 'with', 'as', 'in', 'not', 'and', 'or', 'is', 'None', 'True', 'False', 'lambda', 'pass', 'break', 'continue'],
      html: ['div', 'span', 'html', 'head', 'body', 'script', 'style', 'link', 'meta', 'title', 'p', 'a', 'img', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
      css: ['color', 'background', 'margin', 'padding', 'border', 'display', 'position', 'width', 'height', 'font', 'text', 'flex', 'grid', 'transition', 'animation', 'transform']
    };
    
    const langKeywords = keywords[language] || keywords.javascript;
    
    // Highlight keywords
    langKeywords.forEach(kw => {
      const regex = new RegExp(`\\b(${kw})\\b`, 'g');
      escaped = escaped.replace(regex, '<span style="color:#c792ea;">$1</span>');
    });
    
    // Highlight strings
    escaped = escaped.replace(/(["'`])(.*?)\1/g, '<span style="color:#c3e88d;">$1$2$1</span>');
    
    // Highlight comments
    escaped = escaped.replace(/(\/\/.*$)/gm, '<span style="color:#546e7a;">$1</span>');
    escaped = escaped.replace(/(\/\*[\s\S]*?\*\/)/g, '<span style="color:#546e7a;">$1</span>');
    escaped = escaped.replace(/(#.*$)/gm, '<span style="color:#546e7a;">$1</span>');
    
    // Highlight numbers
    escaped = escaped.replace(/\b(\d+\.?\d*)\b/g, '<span style="color:#f78c6c;">$1</span>');
    
    return escaped;
  }

  function copyToClipboard(btn, code) {
    navigator.clipboard.writeText(code).then(() => {
      const originalText = btn.textContent;
      btn.textContent = 'Copied!';
      btn.style.color = '#6f6';
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.color = '#aaa';
      }, 2000);
    }).catch(() => {
      btn.textContent = 'Failed';
      setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
    });
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  return {
    createCodeBlock,
    createDiffBlock,
    createCodeWithHighlight,
    highlightSyntax,
    copy: copyToClipboard,
    LANG_COLORS
  };
})();

// Make globally accessible for onclick handlers
window.CodeEditor = CodeEditor;
