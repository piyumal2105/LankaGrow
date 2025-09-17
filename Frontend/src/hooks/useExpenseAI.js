import { useState, useCallback } from "react";
import aiService from "../services/aiService";

export const useExpenseAI = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const categorizExpense = useCallback(async (description, amount) => {
    if (!description || !amount) return;

    setLoading(true);
    try {
      const result = await aiService.categorizeExpense(description, amount);
      setSuggestions(result.data ? [result.data] : []);
      return result.data;
    } catch (error) {
      console.error("Error categorizing expense:", error);
      setSuggestions([]);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearSuggestions = () => setSuggestions([]);

  return {
    suggestions,
    loading,
    categorizeExpense,
    clearSuggestions,
  };
};
