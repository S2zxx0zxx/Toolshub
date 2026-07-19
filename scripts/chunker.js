/**
 * Chunker utility for RAG ingestion.
 * Splits text into chunks if it exceeds 500 words, respecting natural paragraph boundaries.
 */

function countWords(str) {
  if (!str) return 0;
  return str.trim().split(/\s+/).length;
}

function chunkText(entry) {
  const WORD_LIMIT = 500;
  
  if (countWords(entry.text) <= WORD_LIMIT) {
    return [entry]; // No chunking needed
  }

  // Split by double newlines first (paragraphs)
  let rawChunks = entry.text.split(/\n\n+/);
  let finalChunks = [];
  let currentChunkText = "";

  for (let i = 0; i < rawChunks.length; i++) {
    const p = rawChunks[i].trim();
    if (!p) continue;

    if (countWords(currentChunkText + "\n\n" + p) <= WORD_LIMIT) {
      currentChunkText = currentChunkText ? currentChunkText + "\n\n" + p : p;
    } else {
      // If the current chunk is not empty, push it
      if (currentChunkText) {
        finalChunks.push(currentChunkText);
      }
      
      // If the single paragraph itself is over the limit, split by sentences
      if (countWords(p) > WORD_LIMIT) {
        // Regex splits sentences by punctuation, keeping punctuation.
        const sentences = p.match(/[^.!?]+[.!?]+/g) || [p];
        currentChunkText = "";
        for (const s of sentences) {
          const sTrimmed = s.trim();
          if (!sTrimmed) continue;
          if (countWords(currentChunkText + " " + sTrimmed) <= WORD_LIMIT) {
            currentChunkText = currentChunkText ? currentChunkText + " " + sTrimmed : sTrimmed;
          } else {
            if (currentChunkText) finalChunks.push(currentChunkText);
            currentChunkText = sTrimmed;
          }
        }
      } else {
        currentChunkText = p;
      }
    }
  }
  
  if (currentChunkText) {
    finalChunks.push(currentChunkText);
  }

  return finalChunks.map((text, idx) => ({
    id: `${entry.id}-chunk-${idx + 1}`,
    category: entry.category,
    text: text.trim()
  }));
}

module.exports = { chunkText, countWords };
