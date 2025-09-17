// src/hooks/useAI.js
import { useState, useEffect, useCallback } from "react";
import aiService from "../services/aiService";

export const useAI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const clearError = () => setError(null);

  const executeAIFunction = useCallback(async (aiFunction, ...args) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await aiFunction(...args);
      return result;
    } catch (err) {
      setError(err.message || "AI service error");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    clearError,
    executeAIFunction,
  };
};
