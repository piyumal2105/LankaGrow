import api from "./api";

export const invoicesAPI = {
  getAll: (params) => api.get("/invoices", { params }),
  getById: (id) => api.get(`/invoices/${id}`),
  create: (invoiceData) => api.post("/invoices", invoiceData),
  update: (id, invoiceData) => api.put(`/invoices/${id}`, invoiceData),
  delete: (id) => api.delete(`/invoices/${id}`),
  markAsPaid: (id) => api.put(`/invoices/${id}/pay`),
  sendInvoice: (id) => api.post(`/invoices/${id}/send`),
  getOverdue: () => api.get("/invoices/overdue"),
  downloadPDF: (id) => api.get(`/invoices/${id}/pdf`, { responseType: "blob" }),
};
