// src/services/aiService.js
import api from "./api";

class AIService {
  // Sales Forecasting
  async getSalesForecasting() {
    try {
      const response = await api.get("/api/ai/sales-forecasting");
      return response.data;
    } catch (error) {
      console.error("Error fetching sales forecasting:", error);
      throw error;
    }
  }

  // Business Insights
  async getBusinessInsights() {
    try {
      const response = await api.get("/api/ai/business-insights");
      return response.data;
    } catch (error) {
      console.error("Error fetching business insights:", error);
      throw error;
    }
  }

  // Expense Categorization
  async categorizeExpense(description, amount) {
    try {
      const response = await api.post("/api/expenses/categorize-ai", {
        description,
        amount,
      });
      return response.data;
    } catch (error) {
      console.error("Error categorizing expense:", error);
      throw error;
    }
  }

  // Inventory Reorder Suggestions
  async getReorderSuggestions(productId) {
    try {
      const response = await api.get(
        `/api/ai/reorder-suggestions/${productId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching reorder suggestions:", error);
      throw error;
    }
  }

  // Price Optimization
  async getPriceOptimization(productData) {
    try {
      const response = await api.post(
        "/api/ai/price-optimization",
        productData
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching price optimization:", error);
      throw error;
    }
  }

  // Cash Flow Prediction
  async getCashFlowPrediction(timeframe = "3months") {
    try {
      const response = await api.get(
        `/api/ai/cash-flow-prediction?timeframe=${timeframe}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching cash flow prediction:", error);
      throw error;
    }
  }
}

export default new AIService();
