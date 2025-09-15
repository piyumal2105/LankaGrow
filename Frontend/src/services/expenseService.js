import api from "./api";

export const expenseService = {
  getExpenses: (params = {}) => api.get("/expenses", { params }),
  getExpense: (id) => api.get(`/expenses/${id}`),
  createExpense: (data) => api.post("/expenses", data),
  updateExpense: (id, data) => api.put(`/expenses/${id}`, data),
  deleteExpense: (id) => api.delete(`/expenses/${id}`),
  categorizeExpense: (data) => api.post("/expenses/categorize", data),
  uploadReceipt: (formData) =>
    api.post("/expenses/upload-receipt", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  // New endpoints for dynamic data
  getRecentExpenses: () => api.get("/expenses/recent"),
  getExpenseAnalytics: () => api.get("/expenses/analytics"),
  getCategoryInsights: () => api.get("/expenses/insights"),
  getMonthlyStats: (params = {}) =>
    api.get("/expenses/monthly-stats", { params }),
};
