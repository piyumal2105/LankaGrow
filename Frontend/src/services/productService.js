import api from "./api";

export const productService = {
  getProducts: (params = {}) => api.get("/products", { params }),
  getProduct: (id) => api.get(`/products/${id}`),
  createProduct: (data) => api.post("/products", data),
  updateProduct: (id, data) => api.put(`/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/products/${id}`),
  updateStock: (id, data) => api.put(`/products/${id}/stock`, data),
  getLowStockProducts: () => api.get("/products/low-stock"),
  getProductAnalytics: () => api.get("/products/analytics"),
};
