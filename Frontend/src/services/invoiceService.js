import api from "./api";

export const invoiceService = {
  getInvoices: async (params = {}) => {
    const response = await api.get("/invoices", { params });
    return response.data; // Return just the response data, not the full Axios response
  },
  getInvoice: async (id) => {
    const response = await api.get(`/invoices/${id}`);
    return response.data;
  },
  createInvoice: async (data) => {
    const response = await api.post("/invoices", data);
    return response.data;
  },
  updateInvoice: async (id, data) => {
    const response = await api.put(`/invoices/${id}`, data);
    return response.data;
  },
  deleteInvoice: async (id) => {
    const response = await api.delete(`/invoices/${id}`);
    return response.data;
  },
  markAsPaid: async (id) => {
    const response = await api.put(`/invoices/${id}/pay`);
    return response.data;
  },
  sendInvoice: async (id) => {
    const response = await api.post(`/invoices/${id}/send`);
    return response.data;
  },
  getOverdueInvoices: async () => {
    const response = await api.get("/invoices/overdue");
    return response.data;
  },
  generatePDF: (id) => api.get(`/invoices/${id}/pdf`, { responseType: "blob" }), // Keep as-is for blob downloads
};
