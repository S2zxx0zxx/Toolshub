export const SearchService = (() => {
  
  async function searchWeb(query) {
    if (!query) throw new Error("Search query is required.");

    const apiKey = localStorage.getItem('TAVILY_API_KEY');
    
    if (apiKey) {
      try {
        const response = await fetch('https://api.tavily.com/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            api_key: apiKey,
            query: query,
            search_depth: "basic",
            include_answer: true,
            max_results: 5
          })
        });

        if (!response.ok) {
          throw new Error(`Tavily API error: ${response.status}`);
        }

        const data = await response.json();
        
        // Map Tavily results to our expected format
        return {
          query: query,
          answer: data.answer || null,
          results: data.results.map(r => ({
            title: r.title,
            snippet: r.content,
            url: r.url
          }))
        };
      } catch (error) {
        console.error("Tavily Search failed:", error);
        // Fallback to mock on error
      }
    }

    // MOCK IMPLEMENTATION (Fallback)
    await new Promise(r => setTimeout(r, 1200));
    return {
      query: query,
      results: [
        {
          title: `Latest insights on ${query}`,
          snippet: `This is a mock search result providing simulated information about ${query}. To integrate real search, configure the SearchAPI provider.`,
          url: "https://example.com/mock-search"
        },
        {
          title: `Related news: ${query}`,
          snippet: `Recent developments indicate that the topic of ${query} is trending globally. This data is simulated.`,
          url: "https://example.com/mock-news"
        }
      ]
    };
  }

  return {
    searchWeb
  };
})();
