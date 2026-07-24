// DESIGN MODE - AI-Powered Visual Designer
import { aiApi } from '../../services/aiApi.js';

export const DesignMode = (() => {
  let canvas = null;
  let selectedComponent = null;
  let components = [];
  let history = [];
  let historyIndex = -1;

  const COMPONENTS = {
    button: { name: 'Button', icon: '🔘', html: '<button class="btn">Button</button>' },
    card: { name: 'Card', icon: '🃏', html: '<div class="card"><h3>Card Title</h3><p>Card content goes here.</p></div>' },
    input: { name: 'Input', icon: '📝', html: '<input type="text" placeholder="Enter text...">' },
    textarea: { name: 'Textarea', icon: '📄', html: '<textarea placeholder="Enter text..."></textarea>' },
    image: { name: 'Image', icon: '🖼️', html: '<img src="https://via.placeholder.com/300x200" alt="Placeholder">' },
    heading: { name: 'Heading', icon: '📌', html: '<h2>Heading</h2>' },
    paragraph: { name: 'Paragraph', icon: '📄', html: '<p>This is a paragraph of text.</p>' },
    list: { name: 'List', icon: '📋', html: '<ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul>' },
    nav: { name: 'Navigation', icon: '🧭', html: '<nav><a href="#">Home</a><a href="#">About</a><a href="#">Contact</a></nav>' },
    footer: { name: 'Footer', icon: '⬇️', html: '<footer><p>© 2024 ToolsHub</p></footer>' },
    hero: { name: 'Hero Section', icon: '🎯', html: '<section class="hero"><h1>Welcome</h1><p>Start building amazing things.</p><button>Get Started</button></section>' },
    form: { name: 'Form', icon: '📋', html: '<form><input type="text" placeholder="Name"><input type="email" placeholder="Email"><button type="submit">Submit</button></form>' }
  };

  function init() {
    initComponentPalette();
    initCanvas();
    initPropertyPanel();
    initAIAssistant();
    initExportEngine();
    initHistory();
  }

  // COMPONENT PALETTE
  function initComponentPalette() {
    const palette = document.getElementById('exclusiveComponentPalette');
    if (!palette) return;
    
    palette.innerHTML = `
      <div class="palette-header">
        <span>Components</span>
      </div>
      <div class="palette-grid">
        ${Object.entries(COMPONENTS).map(([type, comp]) => `
          <div class="palette-item" draggable="true" data-type="${type}">
            <span class="palette-icon">${comp.icon}</span>
            <span class="palette-name">${comp.name}</span>
          </div>
        `).join('')}
      </div>
    `;
    
    // Drag handlers
    palette.querySelectorAll('.palette-item').forEach(item => {
      item.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('component-type', item.dataset.type);
      });
    });
  }

  // CANVAS
  function initCanvas() {
    canvas = document.getElementById('exclusiveDesignCanvas');
    if (!canvas) return;
    
    canvas.innerHTML = `
      <div class="canvas-empty">
        <p>Drag components here to start designing</p>
        <p>Or use AI to generate a design</p>
      </div>
    `;
    
    // Drop handler
    canvas.addEventListener('dragover', (e) => {
      e.preventDefault();
      canvas.classList.add('drag-over');
    });
    
    canvas.addEventListener('dragleave', () => {
      canvas.classList.remove('drag-over');
    });
    
    canvas.addEventListener('drop', (e) => {
      e.preventDefault();
      canvas.classList.remove('drag-over');
      
      const type = e.dataTransfer.getData('component-type');
      if (type && COMPONENTS[type]) {
        addComponent(type, e.offsetX, e.offsetY);
      }
    });
    
    // Click to deselect
    canvas.addEventListener('click', (e) => {
      if (e.target === canvas || e.target.classList.contains('canvas-empty')) {
        deselectAll();
      }
    });
  }

  function addComponent(type, x, y) {
    const comp = COMPONENTS[type];
    if (!comp) return;
    
    const element = document.createElement('div');
    element.className = 'design-component';
    element.dataset.type = type;
    element.dataset.id = Date.now();
    element.innerHTML = comp.html;
    element.style.position = 'absolute';
    element.style.left = `${Math.max(0, x - 50)}px`;
    element.style.top = `${Math.max(0, y - 20)}px`;
    
    // Make draggable
    makeDraggable(element);
    
    // Click to select
    element.addEventListener('click', (e) => {
      e.stopPropagation();
      selectComponent(element);
    });
    
    // Remove empty state
    const empty = canvas.querySelector('.canvas-empty');
    if (empty) empty.remove();
    
    canvas.appendChild(element);
    components.push({ type, id: element.dataset.id, element });
    
    // Save to history
    saveToHistory();
  }

  function makeDraggable(element) {
    let offsetX, offsetY, isDragging = false;
    
    element.addEventListener('mousedown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      isDragging = true;
      offsetX = e.clientX - element.offsetLeft;
      offsetY = e.clientY - element.offsetTop;
      element.style.zIndex = '1000';
      element.style.cursor = 'grabbing';
    });
    
    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      element.style.left = `${e.clientX - offsetX}px`;
      element.style.top = `${e.clientY - offsetY}px`;
    });
    
    document.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        element.style.zIndex = '';
        element.style.cursor = '';
        saveToHistory();
      }
    });
  }

  function selectComponent(element) {
    deselectAll();
    element.classList.add('selected');
    selectedComponent = element;
    updatePropertyPanel(element);
  }

  function deselectAll() {
    canvas?.querySelectorAll('.design-component').forEach(el => {
      el.classList.remove('selected');
    });
    selectedComponent = null;
    clearPropertyPanel();
  }

  // PROPERTY PANEL
  function initPropertyPanel() {
    const panel = document.getElementById('exclusivePropertyPanel');
    if (!panel) return;
    
    panel.innerHTML = `
      <div class="property-header">
        <span>Properties</span>
      </div>
      <div class="property-content">
        <p class="property-empty">Select a component to edit properties</p>
      </div>
    `;
  }

  function updatePropertyPanel(element) {
    const panel = document.getElementById('exclusivePropertyPanel');
    if (!panel || !element) return;
    
    const type = element.dataset.type;
    const styles = window.getComputedStyle(element);
    
    panel.innerHTML = `
      <div class="property-header">
        <span>${COMPONENTS[type]?.name || type}</span>
        <button id="deleteComponentBtn" title="Delete">🗑️</button>
      </div>
      <div class="property-content">
        <div class="property-group">
          <label>Width</label>
          <input type="text" id="propWidth" value="${styles.width}">
        </div>
        <div class="property-group">
          <label>Height</label>
          <input type="text" id="propHeight" value="${styles.height}">
        </div>
        <div class="property-group">
          <label>Background</label>
          <input type="color" id="propBg" value="${rgbToHex(styles.backgroundColor)}">
        </div>
        <div class="property-group">
          <label>Text Color</label>
          <input type="color" id="propColor" value="${rgbToHex(styles.color)}">
        </div>
        <div class="property-group">
          <label>Font Size</label>
          <input type="text" id="propFontSize" value="${styles.fontSize}">
        </div>
        <div class="property-group">
          <label>Padding</label>
          <input type="text" id="propPadding" value="${styles.padding}">
        </div>
        <div class="property-group">
          <label>Border Radius</label>
          <input type="text" id="propBorderRadius" value="${styles.borderRadius}">
        </div>
      </div>
    `;
    
    // Apply changes
    const applyStyle = (prop, value) => {
      if (selectedComponent) {
        selectedComponent.style[prop] = value;
      }
    };
    
    document.getElementById('propWidth')?.addEventListener('input', (e) => applyStyle('width', e.target.value));
    document.getElementById('propHeight')?.addEventListener('input', (e) => applyStyle('height', e.target.value));
    document.getElementById('propBg')?.addEventListener('input', (e) => applyStyle('backgroundColor', e.target.value));
    document.getElementById('propColor')?.addEventListener('input', (e) => applyStyle('color', e.target.value));
    document.getElementById('propFontSize')?.addEventListener('input', (e) => applyStyle('fontSize', e.target.value));
    document.getElementById('propPadding')?.addEventListener('input', (e) => applyStyle('padding', e.target.value));
    document.getElementById('propBorderRadius')?.addEventListener('input', (e) => applyStyle('borderRadius', e.target.value));
    
    // Delete button
    document.getElementById('deleteComponentBtn')?.addEventListener('click', () => {
      if (selectedComponent) {
        selectedComponent.remove();
        components = components.filter(c => c.element !== selectedComponent);
        selectedComponent = null;
        clearPropertyPanel();
        saveToHistory();
      }
    });
  }

  function clearPropertyPanel() {
    const panel = document.getElementById('exclusivePropertyPanel');
    if (panel) {
      panel.querySelector('.property-content').innerHTML = '<p class="property-empty">Select a component to edit properties</p>';
    }
  }

  function rgbToHex(rgb) {
    if (rgb.startsWith('#')) return rgb;
    const match = rgb.match(/\d+/g);
    if (!match) return '#000000';
    return '#' + match.slice(0, 3).map(x => parseInt(x).toString(16).padStart(2, '0')).join('');
  }

  // AI ASSISTANT
  function initAIAssistant() {
    const aiPanel = document.getElementById('exclusiveDesignAI');
    if (!aiPanel) return;
    
    aiPanel.innerHTML = `
      <div class="ai-panel-header">
        <span>AI Design Assistant</span>
      </div>
      <div class="ai-panel-content">
        <div class="ai-suggestion" data-prompt="Generate a modern landing page hero section">🎯 Hero Section</div>
        <div class="ai-suggestion" data-prompt="Create a pricing card component">💰 Pricing Card</div>
        <div class="ai-suggestion" data-prompt="Build a navigation bar">🧭 Navigation</div>
        <div class="ai-suggestion" data-prompt="Design a contact form">📋 Contact Form</div>
        <div class="ai-suggestion" data-prompt="Create a feature grid section">✨ Features Grid</div>
        <div class="ai-suggestion" data-prompt="Build a footer with links">⬇️ Footer</div>
      </div>
      <div class="ai-panel-input">
        <input type="text" id="designAiInput" placeholder="Describe what you want to design...">
        <button id="designAiSendBtn">Generate</button>
      </div>
    `;
    
    // Suggestion clicks
    aiPanel.querySelectorAll('.ai-suggestion').forEach(s => {
      s.addEventListener('click', () => generateDesign(s.dataset.prompt));
    });
    
    // Send button
    document.getElementById('designAiSendBtn')?.addEventListener('click', () => {
      const input = document.getElementById('designAiInput');
      if (input?.value) {
        generateDesign(input.value);
        input.value = '';
      }
    });
  }

  async function generateDesign(prompt) {
    const output = document.querySelector('.ai-panel-content');
    if (!output) return;
    
    output.innerHTML += `<div class="ai-message user">${prompt}</div>`;
    
    try {
      const messages = [
        { role: 'system', content: `You are a UI/UX designer. Generate HTML/CSS for the requested component. 
Return ONLY the HTML code, no explanations. Use modern design principles.
Include inline styles for immediate rendering.` },
        { role: 'user', content: prompt }
      ];
      
      const response = await aiApi.chatCompletionJson(messages);
      const content = response.choices?.[0]?.message?.content || '';
      
      // Extract HTML from response
      const htmlMatch = content.match(/```html\n([\s\S]*?)```/) || content.match(/```\n([\s\S]*?)```/);
      const html = htmlMatch ? htmlMatch[1] : content;
      
      // Add to canvas
      addAIComponent(html, prompt);
      
      output.innerHTML += `<div class="ai-message assistant">Design generated! Check the canvas.</div>`;
    } catch (error) {
      output.innerHTML += `<div class="ai-message error">Error: ${error.message}</div>`;
    }
  }

  function addAIComponent(html, title) {
    const element = document.createElement('div');
    element.className = 'design-component ai-generated';
    element.dataset.type = 'ai';
    element.dataset.id = Date.now();
    element.innerHTML = html;
    element.style.position = 'absolute';
    element.style.left = '50px';
    element.style.top = `${50 + components.length * 30}px`;
    element.style.minWidth = '200px';
    
    makeDraggable(element);
    element.addEventListener('click', (e) => {
      e.stopPropagation();
      selectComponent(element);
    });
    
    const empty = canvas?.querySelector('.canvas-empty');
    if (empty) empty.remove();
    
    canvas?.appendChild(element);
    components.push({ type: 'ai', id: element.dataset.id, element });
    saveToHistory();
  }

  // EXPORT ENGINE
  function initExportEngine() {
    const exportBtn = document.getElementById('exclusiveExportBtn');
    if (exportBtn) {
      exportBtn.addEventListener('click', showExportOptions);
    }
  }

  function showExportOptions() {
    const options = ['HTML/CSS', 'React', 'Vue', 'Next.js'];
    const choice = prompt(`Export as:\n1. HTML/CSS\n2. React\n3. Vue\n4. Next.js\n\nEnter number:`);
    
    switch (choice) {
      case '1':
        exportAsHTML();
        break;
      case '2':
        exportAsReact();
        break;
      case '3':
        exportAsVue();
        break;
      case '4':
        exportAsNextjs();
        break;
      default:
        alert('Invalid choice');
    }
  }

  function exportAsHTML() {
    const html = generateHTML();
    downloadFile('design.html', html, 'text/html');
  }

  function exportAsReact() {
    const react = generateReact();
    downloadFile('Design.jsx', react, 'text/javascript');
  }

  function exportAsVue() {
    const vue = generateVue();
    downloadFile('Design.vue', vue, 'text/javascript');
  }

  function exportAsNextjs() {
    const nextjs = generateNextjs();
    downloadFile('page.js', nextjs, 'text/javascript');
  }

  function generateHTML() {
    const componentsHTML = Array.from(canvas?.querySelectorAll('.design-component') || [])
      .map(el => el.outerHTML)
      .join('\n');
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Design by ToolsHub</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; padding: 20px; }
    .design-component { position: relative; margin: 10px; }
  </style>
</head>
<body>
${componentsHTML}
</body>
</html>`;
  }

  function generateReact() {
    return `import React from 'react';

export default function Design() {
  return (
    <div className="design-container">
      {/* Components will be rendered here */}
      <p>Export your design from ToolsHub Exclusive</p>
    </div>
  );
}`;
  }

  function generateVue() {
    return `<template>
  <div class="design-container">
    <!-- Components will be rendered here -->
    <p>Export your design from ToolsHub Exclusive</p>
  </div>
</template>

<script>
export default {
  name: 'Design'
}
</script>`;
  }

  function generateNextjs() {
    return `export default function Design() {
  return (
    <div className="design-container">
      {/* Components will be rendered here */}
      <p>Export your design from ToolsHub Exclusive</p>
    </div>
  );
}`;
  }

  function downloadFile(filename, content, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  // HISTORY
  function initHistory() {
    saveToHistory();
  }

  function saveToHistory() {
    const state = Array.from(canvas?.querySelectorAll('.design-component') || []).map(el => ({
      type: el.dataset.type,
      id: el.dataset.id,
      html: el.innerHTML,
      styles: el.style.cssText
    }));
    
    history = history.slice(0, historyIndex + 1);
    history.push(state);
    historyIndex = history.length - 1;
    
    updateHistoryButtons();
  }

  function undo() {
    if (historyIndex > 0) {
      historyIndex--;
      restoreState(history[historyIndex]);
      updateHistoryButtons();
    }
  }

  function redo() {
    if (historyIndex < history.length - 1) {
      historyIndex++;
      restoreState(history[historyIndex]);
      updateHistoryButtons();
    }
  }

  function restoreState(state) {
    if (!canvas) return;
    
    canvas.innerHTML = '';
    components = [];
    
    state.forEach(comp => {
      const element = document.createElement('div');
      element.className = 'design-component';
      element.dataset.type = comp.type;
      element.dataset.id = comp.id;
      element.innerHTML = comp.html;
      element.style.cssText = comp.styles;
      
      makeDraggable(element);
      element.addEventListener('click', (e) => {
        e.stopPropagation();
        selectComponent(element);
      });
      
      canvas.appendChild(element);
      components.push({ type: comp.type, id: comp.id, element });
    });
  }

  function updateHistoryButtons() {
    const undoBtn = document.getElementById('undoBtn');
    const redoBtn = document.getElementById('redoBtn');
    
    if (undoBtn) undoBtn.disabled = historyIndex <= 0;
    if (redoBtn) redoBtn.disabled = historyIndex >= history.length - 1;
  }

  // PUBLIC API
  function getComponents() {
    return components.map(c => ({
      type: c.type,
      id: c.id,
      html: c.element?.outerHTML || ''
    }));
  }

  function exportAsJSON() {
    return JSON.stringify(getComponents(), null, 2);
  }

  return {
    init,
    addComponent,
    undo,
    redo,
    getComponents,
    exportAsJSON
  };
})();
