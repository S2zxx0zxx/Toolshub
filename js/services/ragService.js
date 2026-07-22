import { API_ENDPOINT } from '../config/api.js';

export const ragService = (() => {

  async function ingestToRAG(text, metadata = {}) {
    if (!text) throw new Error("Text is required for RAG ingestion.");

    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'rag_ingest',
          text: text,
          metadata: metadata
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`RAG ingestion error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("RAG Ingestion failed:", error);
      throw error;
    }
  }

  async function queryRAG(query) {
    if (!query) throw new Error("Query is required for RAG.");

    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'rag_query',
          query: query
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`RAG query error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("RAG Query failed:", error);
      throw error;
    }
  }

  return {
    ingestToRAG,
    queryRAG
  };
})();
