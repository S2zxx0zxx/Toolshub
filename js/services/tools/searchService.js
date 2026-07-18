export const SearchService = (() => {
  
  const API_ENDPOINT = 'https://toolshub-api-worker.theliquidlounge-co.workers.dev';

  async function searchWeb(query) {
    if (!query) throw new Error("Search query is required.");

    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'search',
          query: query
        })
      });

      if (!response.ok) {
        throw new Error(`Search service error: ${response.status}`);
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
      console.error("Web Search failed:", error);
      throw new Error("Search is currently unavailable.");
    }
  }

  return {
    searchWeb
  };
})();
