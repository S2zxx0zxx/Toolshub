export const CalculatorService = (() => {
  
  function normalizePercent(expr) {
    // "15% of 4500" -> "15/100*4500"
    let out = expr.replace(/(\d+(?:\.\d+)?)\s*%\s*of\s*(\d+(?:\.\d+)?)/gi, '($1/100*$2)');
    // Remaining standalone "N%" -> "(N/100)"
    out = out.replace(/(\d+(?:\.\d+)?)\s*%/g, '($1/100)');
    return out;
  }

  async function evaluate(expression) {
    const withPercent = normalizePercent(expression);
    // Basic sanitization
    const sanitized = withPercent.replace(/[^0-9\+\-\*\/\(\)\.]/g, '');
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
