import api from "./api";

export const productService = {
  getProducts: async (params = {}) => {
    const response = await api.get("/products", { params });
    return response.data;
  },

  getProduct: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  createProduct: async (data) => {
    const response = await api.post("/products", data);
    return response.data;
  },

  updateProduct: async (id, data) => {
    const response = await api.put(`/products/${id}`, data);
    return response.data;
  },

  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  updateStock: async (id, data) => {
    const response = await api.put(`/products/${id}/stock`, data);
    return response.data;
  },

  getLowStockProducts: async () => {
    const response = await api.get("/products/low-stock");
    return response.data;
  },

  getProductAnalytics: async () => {
    const response = await api.get("/products/analytics");
    return response.data;
  },
};
