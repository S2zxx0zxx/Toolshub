import { LocalSettings } from '../services/localSettings.js';

export const GithubTools = (() => {

  async function _githubApiFetch(endpoint, isRaw = false) {
    const token = LocalSettings.getGithubToken();
    if (!token) {
      throw new Error("GitHub token not found. Please connect your GitHub account in Advanced Controls > Connectors.");
    }

    const headers = {
      "Authorization": `token ${token}`
    };
    if (isRaw) {
      headers["Accept"] = "application/vnd.github.v3.raw";
    } else {
      headers["Accept"] = "application/vnd.github.v3+json";
    }

    const response = await fetch(`https://api.github.com${endpoint}`, { headers });
    
    if (!response.ok) {
      throw new Error(`GitHub API Error: ${response.status} ${response.statusText}`);
    }

    if (isRaw) {
      return await response.text();
    }
    return await response.json();
  }

  // --- Tools implementation ---
  
  async function listRepositoryFiles(params) {
    const repo = LocalSettings.getGithubRepo();
    if (!repo) throw new Error("No active GitHub repository selected.");
    
    // Get default branch first
    let branch = params.branch;
    if (!branch) {
      const repoData = await _githubApiFetch(`/repos/${repo}`);
      branch = repoData.default_branch;
    }
    
    // Fetch recursive tree
    const treeData = await _githubApiFetch(`/repos/${repo}/git/trees/${branch}?recursive=1`);
    if (treeData.truncated) {
      // If truncated, we just return the first chunk, maybe warn
    }
    
    const files = treeData.tree
      .filter(item => item.type === 'blob')
      .map(item => item.path);
      
    return files.join('\n');
  }

  async function readGithubFile(params) {
    const repo = LocalSettings.getGithubRepo();
    if (!repo) throw new Error("No active GitHub repository selected.");
    const { path } = params;
    
    const content = await _githubApiFetch(`/repos/${repo}/contents/${path}`, true);
    return content;
  }
  
  async function searchGithubCode(params) {
    const repo = LocalSettings.getGithubRepo();
    if (!repo) throw new Error("No active GitHub repository selected.");
    const { query } = params;
    
    const searchData = await _githubApiFetch(`/search/code?q=${encodeURIComponent(query)}+repo:${repo}`);
    
    const results = searchData.items.map(item => ({
      path: item.path,
      url: item.html_url
    }));
    
    return JSON.stringify(results, null, 2);
  }

  // Tool Definitions
  const tools = [
    {
      id: 'github_list_files',
      title: 'List GitHub Repository Files',
      sub: 'List all files in the connected GitHub repository',
      icon: 'social', 
      parameters: {
        type: "object",
        properties: {
          branch: { type: "string", description: "Optional branch name. Defaults to main/master." }
        }
      },
      execute: listRepositoryFiles
    },
    {
      id: 'github_read_file',
      title: 'Read GitHub File',
      sub: 'Read the contents of a file from the connected GitHub repository',
      icon: 'social',
      parameters: {
        type: "object",
        properties: {
          path: { type: "string", description: "The file path in the repository (e.g. src/index.js)" }
        },
        required: ["path"]
      },
      execute: readGithubFile
    },
    {
      id: 'github_search_code',
      title: 'Search GitHub Code',
      sub: 'Search for code inside the connected GitHub repository',
      icon: 'social',
      parameters: {
        type: "object",
        properties: {
          query: { type: "string", description: "The search query" }
        },
        required: ["query"]
      },
      execute: searchGithubCode
    }
  ];

  return { tools };
})();
