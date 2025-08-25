import api from "./api";

export const expensesAPI = {
  getAll: (params) => api.get("/expenses", { params }),
  getById: (id) => api.get(`/expenses/${id}`),
  create: (expenseData) => api.post("/expenses", expenseData),
  update: (id, expenseData) => api.put(`/expenses/${id}`, expenseData),
  delete: (id) => api.delete(`/expenses/${id}`),
  categorize: (expenseData) => api.post("/expenses/categorize", expenseData),
  uploadReceipt: (formData) =>
    api.post("/expenses/upload-receipt", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
};
