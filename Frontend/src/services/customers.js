import api from "./api";

export const customersAPI = {
  getAll: (params) => api.get("/customers", { params }),
  getById: (id) => api.get(`/customers/${id}`),
  create: (customerData) => api.post("/customers", customerData),
  update: (id, customerData) => api.put(`/customers/${id}`, customerData),
  delete: (id) => api.delete(`/customers/${id}`),
  getTopCustomers: () => api.get("/customers/top-customers"),
  getAnalytics: () => api.get("/customers/analytics"),
};
