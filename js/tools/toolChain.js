export const ToolChain = (() => {
  
  const CHAIN_TEMPLATES = {
    'research-write-post': {
      name: 'Research → Write → Post',
      steps: ['search', 'blog-post', 'ig-caption'],
      description: 'Research a topic, write a blog post, then create social media content'
    },
    'analyze-fix-test': {
      name: 'Analyze → Fix → Test',
      steps: ['github_read_file', 'github_search_code', 'github_list_files'],
      description: 'Analyze code, find issues, then list related files'
    },
    'create-review-publish': {
      name: 'Create → Review → Publish',
      steps: ['blog-post', 'search', 'x-thread'],
      description: 'Create content, verify with search, then share on social'
    },
    'content-suite': {
      name: 'Full Content Suite',
      steps: ['blog-post', 'ig-caption', 'x-thread', 'yt-meta'],
      description: 'Create content for all platforms at once'
    }
  };

  function detectChain(userMessage) {
    const msg = userMessage.toLowerCase();
    
    // Research + Write patterns
    if ((msg.includes('research') || msg.includes('find out')) && 
        (msg.includes('write') || msg.includes('blog') || msg.includes('post'))) {
      return CHAIN_TEMPLATES['research-write-post'];
    }
    
    // Code analysis patterns
    if (msg.includes('analyze') && msg.includes('code') || 
        msg.includes('review') && msg.includes('github')) {
      return CHAIN_TEMPLATES['analyze-fix-test'];
    }
    
    // Full content suite
    if (msg.includes('all platforms') || msg.includes('everywhere') || 
        msg.includes('content suite') || msg.includes('everything')) {
      return CHAIN_TEMPLATES['content-suite'];
    }
    
    // Create + Share patterns
    if ((msg.includes('create') || msg.includes('write')) && 
        (msg.includes('share') || msg.includes('post') || msg.includes('social'))) {
      return CHAIN_TEMPLATES['create-review-publish'];
    }
    
    return null;
  }

  function getNextToolInChain(currentTool, chain) {
    if (!chain || !chain.steps) return null;
    const currentIndex = chain.steps.indexOf(currentTool);
    if (currentIndex === -1 || currentIndex >= chain.steps.length - 1) return null;
    return chain.steps[currentIndex + 1];
  }

  function suggestChain(userMessage) {
    const chain = detectChain(userMessage);
    if (!chain) return null;
    
    return {
      detected: true,
      chain: chain,
      suggestion: `I detected this might be a multi-step task. I can use the "${chain.name}" workflow: ${chain.description}. Should I proceed with this approach?`
    };
  }

  function getAvailableChains() {
    return Object.entries(CHAIN_TEMPLATES).map(([id, template]) => ({
      id,
      ...template
    }));
  }

  return {
    detectChain,
    getNextToolInChain,
    suggestChain,
    getAvailableChains,
    CHAIN_TEMPLATES
  };
})();
