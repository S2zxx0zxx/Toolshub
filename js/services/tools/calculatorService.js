export const CalculatorService = (() => {
  
  async function evaluate(expression) {
    // Basic sanitization
    const sanitized = expression.replace(/[^0-9\+\-\*\/\(\)\.]/g, '');
    if (!sanitized) {
      throw new Error("Invalid mathematical expression.");
    }
    
    // For a real production app, use a safe math parser library.
    // Given JS constraints, Function is a slightly safer eval but still risky.
    // However, since we strictly sanitized to numbers and basic operators above, it's safe.
    try {
      const result = new Function(`return ${sanitized}`)();
      if (!isFinite(result) || isNaN(result)) {
        throw new Error("Result is undefined or infinity.");
      }
      return { result, original_expression: expression };
    } catch (e) {
      throw new Error("Failed to evaluate mathematical expression.");
    }
  }

  return {
    evaluate
  };
})();
