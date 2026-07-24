// EXCLUSIVE SHELL - Main controller for Exclusive Mode
import { ExclusiveAccess } from '../state/exclusiveAccess.js';
import { ExclusiveRouter } from './exclusiveRouter.js';
import { LocalSettings } from '../../services/localSettings.js';
import { Auth } from '../../services/auth.js';

export const ExclusiveShell = (() => {
  let currentMode = 'code'; // 'code' or 'design'
  let isInitialized = false;

  function init() {
    if (isInitialized) return;
    
    // Check access
    if (!ExclusiveAccess.isUnlocked()) {
      showUpgradePrompt();
      return;
    }
    
    // Setup mode switcher
    setupModeSwitcher();
    
    // Setup navigation
    setupNavigation();
    
    // Setup theme
    setupTheme();
    
    isInitialized = true;
  }

  function setupModeSwitcher() {
    const codeBtn = document.getElementById('exclusiveCodeMode');
    const designBtn = document.getElementById('exclusiveDesignMode');
    
    if (codeBtn) {
      codeBtn.addEventListener('click', () => switchMode('code'));
    }
    
    if (designBtn) {
      designBtn.addEventListener('click', () => switchMode('design'));
    }
    
    // Set initial mode
    switchMode(currentMode);
  }

  function switchMode(mode) {
    currentMode = mode;
    
    // Update UI
    document.querySelectorAll('.exclusive-mode-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.mode === mode);
    });
    
    // Show/hide mode-specific panels
    const codePanel = document.getElementById('exclusiveCodePanel');
    const designPanel = document.getElementById('exclusiveDesignPanel');
    
    if (codePanel) codePanel.style.display = mode === 'code' ? 'flex' : 'none';
    if (designPanel) designPanel.style.display = mode === 'design' ? 'flex' : 'none';
    
    // Update sidebar
    updateSidebarForMode(mode);
    
    // Initialize mode-specific features
    if (mode === 'code') {
      initCodeMode();
    } else {
      initDesignMode();
    }
  }

  function updateSidebarForMode(mode) {
    const sidebar = document.querySelector('.exclusive-sidebar');
    if (!sidebar) return;
    
    const modeIndicator = sidebar.querySelector('.mode-indicator');
    if (modeIndicator) {
      modeIndicator.textContent = mode === 'code' ? '💻 Code Mode' : '🎨 Design Mode';
    }
  }

  function initCodeMode() {
    // Initialize code editor, file explorer, terminal
    console.log('[Exclusive] Initializing Code Mode');
    
    // Load Monaco Editor if not loaded
    if (!window.monaco) {
      loadMonacoEditor();
    }
  }

  function initDesignMode() {
    // Initialize canvas, component palette, property panel
    console.log('[Exclusive] Initializing Design Mode');
    
    // Load design canvas
    initDesignCanvas();
  }

  function loadMonacoEditor() {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/monaco-editor@0.44.0/min/vs/loader.js';
    script.onload = () => {
      require.config({ paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.44.0/min/vs' } });
      require(['vs/editor/editor.main'], () => {
        console.log('[Exclusive] Monaco Editor loaded');
      });
    };
    document.head.appendChild(script);
  }

  function initDesignCanvas() {
    const canvas = document.getElementById('exclusiveDesignCanvas');
    if (!canvas) return;
    
    // Initialize drag-and-drop
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
      
      const componentType = e.dataTransfer.getData('component-type');
      if (componentType) {
        addComponentToCanvas(componentType, e.offsetX, e.offsetY);
      }
    });
  }

  function addComponentToCanvas(type, x, y) {
    const canvas = document.getElementById('exclusiveDesignCanvas');
    if (!canvas) return;
    
    const component = document.createElement('div');
    component.className = `design-component design-${type}`;
    component.style.left = `${x}px`;
    component.style.top = `${y}px`;
    component.draggable = true;
    
    // Add component content based on type
    switch (type) {
      case 'button':
        component.innerHTML = '<button>Button</button>';
        break;
      case 'card':
        component.innerHTML = '<div class="card"><h3>Card Title</h3><p>Card content</p></div>';
        break;
      case 'input':
        component.innerHTML = '<input type="text" placeholder="Input...">';
        break;
      case 'text':
        component.innerHTML = '<p>Text content</p>';
        break;
      default:
        component.innerHTML = `<div>${type}</div>`;
    }
    
    canvas.appendChild(component);
    
    // Make draggable within canvas
    makeDraggable(component);
  }

  function makeDraggable(element) {
    let offsetX, offsetY, isDragging = false;
    
    element.addEventListener('mousedown', (e) => {
      isDragging = true;
      offsetX = e.clientX - element.offsetLeft;
      offsetY = e.clientY - element.offsetTop;
      element.style.zIndex = 1000;
    });
    
    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      element.style.left = `${e.clientX - offsetX}px`;
      element.style.top = `${e.clientY - offsetY}px`;
    });
    
    document.addEventListener('mouseup', () => {
      isDragging = false;
      element.style.zIndex = '';
    });
  }

  function setupNavigation() {
    // Home button
    const homeBtn = document.getElementById('exclusiveHomeBtn');
    if (homeBtn) {
      homeBtn.addEventListener('click', () => ExclusiveRouter.navigate('home'));
    }
    
    // Chat button
    const chatBtn = document.getElementById('exclusiveChatBtn');
    if (chatBtn) {
      chatBtn.addEventListener('click', () => ExclusiveRouter.navigate('chat'));
    }
    
    // Dashboard button
    const dashboardBtn = document.getElementById('exclusiveDashboardBtn');
    if (dashboardBtn) {
      dashboardBtn.addEventListener('click', () => ExclusiveRouter.navigate('dashboard'));
    }
    
    // Back to main app
    const backBtn = document.getElementById('exclusiveBackBtn');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        window.location.href = './';
      });
    }
  }

  function setupTheme() {
    const theme = LocalSettings.getTheme() || 'dark';
    document.documentElement.setAttribute('data-theme', theme);
  }

  function showUpgradePrompt() {
    const shell = document.getElementById('exclusiveShell');
    if (shell) {
      shell.innerHTML = `
        <div class="exclusive-upgrade-prompt">
          <h2>Upgrade to Exclusive</h2>
          <p>Unlock Code Mode + Design Mode with AI-powered features.</p>
          <div class="exclusive-features">
            <div class="feature">💻 Code Mode - Live code execution, multi-file projects, AI assistant</div>
            <div class="feature">🎨 Design Mode - Visual canvas, component library, AI design assistant</div>
            <div class="feature">🤖 Multi-model AI - Synthesize responses from multiple AI models</div>
          </div>
          <button class="btn btn-primary" onclick="window.location.href='./'">Upgrade Now - ₹299/month</button>
        </div>
      `;
    }
  }

  function getCurrentMode() {
    return currentMode;
  }

  function isReady() {
    return isInitialized;
  }

  return {
    init,
    switchMode,
    getCurrentMode,
    isReady
  };
})();
