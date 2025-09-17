import React, { createContext, useContext, useState, useEffect } from "react";
import aiService from "../services/aiService";

const AIContext = createContext({});

export const useAIContext = () => {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error("useAIContext must be used within AIProvider");
  }
  return context;
};

export const AIProvider = ({ children }) => {
  const [aiEnabled, setAIEnabled] = useState(true);
  const [aiCredits, setAICredits] = useState(100); // For tiered pricing
  const [aiUsage, setAIUsage] = useState({
    forecasting: 0,
    categorization: 0,
    insights: 0,
  });

  // Track AI usage for billing
  const trackAIUsage = (type) => {
    setAIUsage((prev) => ({
      ...prev,
      [type]: prev[type] + 1,
    }));

    // Deduct credits if using pay-per-use model
    if (aiCredits > 0) {
      setAICredits((prev) => Math.max(0, prev - 1));
    }
  };

  const value = {
    aiEnabled,
    aiCredits,
    aiUsage,
    trackAIUsage,
    setAIEnabled,
  };

  return <AIContext.Provider value={value}>{children}</AIContext.Provider>;
};
