import api from "./api";

export const reportsAPI = {
  getDashboardStats: () => api.get("/reports/dashboard"),
  getProfitLoss: (params) => api.get("/reports/profit-loss", { params }),
  getSalesReport: (params) => api.get("/reports/sales", { params }),
  getCashFlow: (params) => api.get("/reports/cashflow", { params }),
  getInventoryReport: () => api.get("/reports/inventory"),
  getAIInsights: () => api.get("/reports/ai-insights"),
};
