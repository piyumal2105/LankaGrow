import { useState, useEffect } from "react";
import aiService from "../services/aiService";

export const useBusinessInsights = (refreshInterval = 300000) => {
  // 5 minutes
  const [insights, setInsights] = useState([]);
  const [salesForecast, setSalesForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchInsights = useCallback(async () => {
    try {
      setLoading(true);
      const [insightsData, forecastData] = await Promise.all([
        aiService.getBusinessInsights(),
        aiService.getSalesForecasting(),
      ]);

      setInsights(insightsData.data || []);
      setSalesForecast(forecastData.data || null);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error fetching business insights:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInsights();

    const interval = setInterval(fetchInsights, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchInsights, refreshInterval]);

  return {
    insights,
    salesForecast,
    loading,
    lastUpdated,
    refreshInsights: fetchInsights,
  };
};
