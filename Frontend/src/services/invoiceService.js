import api from "./api";

export const invoiceService = {
  getInvoices: (params = {}) => api.get("/invoices", { params }),
  getInvoice: (id) => api.get(`/invoices/${id}`),
  createInvoice: (data) => api.post("/invoices", data),
  updateInvoice: (id, data) => api.put(`/invoices/${id}`, data),
  deleteInvoice: (id) => api.delete(`/invoices/${id}`),
  markAsPaid: (id) => api.put(`/invoices/${id}/pay`),
  sendInvoice: (id) => api.post(`/invoices/${id}/send`),
  getOverdueInvoices: () => api.get("/invoices/overdue"),
  generatePDF: (id) => api.get(`/invoices/${id}/pdf`, { responseType: "blob" }),
};
