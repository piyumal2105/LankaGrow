import api from "./api";

export const customerService = {
  getCustomers: async (params = {}) => {
    const response = await api.get("/customers", { params });
    return response.data;
  },
  getCustomer: async (id) => {
    const response = await api.get(`/customers/${id}`);
    return response.data;
  },
  createCustomer: async (data) => {
    const response = await api.post("/customers", data);
    return response.data;
  },
  updateCustomer: async (id, data) => {
    const response = await api.put(`/customers/${id}`, data);
    return response.data;
  },
  deleteCustomer: async (id) => {
    const response = await api.delete(`/customers/${id}`);
    return response.data;
  },
  getTopCustomers: async () => {
    const response = await api.get("/customers/top-customers");
    return response.data;
  },
  getCustomerAnalytics: async () => {
    const response = await api.get("/customers/analytics");
    return response.data;
  },
};
