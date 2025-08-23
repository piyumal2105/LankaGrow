const API_BASE_URL = "http://localhost:3001/api";

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Request failed");
      }

      return data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }

  // Auth methods
  async login(credentials) {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  async register(userData) {
    return this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  // Dashboard methods
  async getDashboard() {
    return this.request("/reports/dashboard");
  }

  // Product methods
  async getProducts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/products${queryString ? `?${queryString}` : ""}`);
  }

  async createProduct(product) {
    return this.request("/products", {
      method: "POST",
      body: JSON.stringify(product),
    });
  }

  async updateProduct(id, product) {
    return this.request(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(product),
    });
  }

  async deleteProduct(id) {
    return this.request(`/products/${id}`, {
      method: "DELETE",
    });
  }

  // Customer methods
  async getCustomers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/customers${queryString ? `?${queryString}` : ""}`);
  }

  async createCustomer(customer) {
    return this.request("/customers", {
      method: "POST",
      body: JSON.stringify(customer),
    });
  }

  // Invoice methods
  async getInvoices(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/invoices${queryString ? `?${queryString}` : ""}`);
  }

  async createInvoice(invoice) {
    return this.request("/invoices", {
      method: "POST",
      body: JSON.stringify(invoice),
    });
  }

  // Report methods
  async getProfitLoss(params) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/reports/profit-loss?${queryString}`);
  }

  async getAIInsights() {
    return this.request("/reports/ai-insights");
  }

  // Expense methods
  async getExpenses(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/expenses${queryString ? `?${queryString}` : ""}`);
  }

  async createExpense(expense) {
    return this.request("/expenses", {
      method: "POST",
      body: JSON.stringify(expense),
    });
  }
}

export default new ApiService();
