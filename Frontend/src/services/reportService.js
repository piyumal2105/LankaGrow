import api from "./api";

export const reportService = {
  getDashboardStats: () => api.get("/reports/dashboard"),
  getProfitLossReport: (params) => api.get("/reports/profit-loss", { params }),
  getSalesReport: (params) => api.get("/reports/sales", { params }),
  getInventoryReport: () => api.get("/reports/inventory"),
  getCashFlowReport: (params) => api.get("/reports/cashflow", { params }),
  getAIInsights: () => api.get("/reports/ai-insights"),
};
