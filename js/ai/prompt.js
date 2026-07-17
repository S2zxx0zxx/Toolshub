export const PromptManager = (() => {
  const DEFAULT_SYSTEM_PROMPT = "You are Toolshub AI, an intelligent assistant that helps users discover, understand and use AI tools.";

  function getSystemPrompt() {
    return DEFAULT_SYSTEM_PROMPT;
  }

  return {
    getSystemPrompt
  };
})();
