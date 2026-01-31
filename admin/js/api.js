/**
 * PANYA Admin - API Client
 * Handles all API communication with the backend
 */

const API = {
  // Base URL - change for production
  baseUrl: "http://localhost:3001/api",

  /**
   * Get stored auth token
   */
  getToken() {
    return (
      localStorage.getItem("panya_token") ||
      sessionStorage.getItem("panya_token")
    );
  },

  /**
   * Set auth token
   */
  setToken(token, remember = false) {
    if (remember) {
      localStorage.setItem("panya_token", token);
    } else {
      sessionStorage.setItem("panya_token", token);
    }
  },

  /**
   * Clear auth token
   */
  clearToken() {
    localStorage.removeItem("panya_token");
    sessionStorage.removeItem("panya_token");
    localStorage.removeItem("panya_user");
    sessionStorage.removeItem("panya_user");
  },

  /**
   * Store user data
   */
  setUser(user, remember = false) {
    const data = JSON.stringify(user);
    if (remember) {
      localStorage.setItem("panya_user", data);
    } else {
      sessionStorage.setItem("panya_user", data);
    }
  },

  /**
   * Get stored user data
   */
  getUser() {
    const data =
      localStorage.getItem("panya_user") ||
      sessionStorage.getItem("panya_user");
    return data ? JSON.parse(data) : null;
  },

  /**
   * Make API request
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const token = this.getToken();

    const config = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    // Convert body to JSON string
    if (config.body && typeof config.body === "object") {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        // Handle 401 - redirect to login
        if (response.status === 401) {
          this.clearToken();
          if (!window.location.pathname.includes("login")) {
            window.location.href = "login.html";
          }
        }
        throw new Error(data.error || "API request failed");
      }

      return data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  },

  // ==================== AUTH ====================

  /**
   * Login user
   */
  async login(email, password, remember = false) {
    const data = await this.request("/auth/login", {
      method: "POST",
      body: { email, password },
    });

    if (data.token && data.user) {
      this.setToken(data.token, remember);
      this.setUser(data.user, remember);
    }

    return data;
  },

  /**
   * Logout user
   */
  async logout() {
    try {
      await this.request("/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      this.clearToken();
      window.location.href = "login.html";
    }
  },

  /**
   * Get current user info
   */
  async me() {
    return this.request("/auth/me");
  },

  /**
   * Refresh token
   */
  async refreshToken() {
    const data = await this.request("/auth/refresh", { method: "POST" });
    if (data.token) {
      const remember = !!localStorage.getItem("panya_token");
      this.setToken(data.token, remember);
    }
    return data;
  },

  // ==================== USERS ====================

  /**
   * List users
   */
  async getUsers(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/users${query ? `?${query}` : ""}`);
  },

  /**
   * Get single user
   */
  async getUser(id) {
    return this.request(`/users/${id}`);
  },

  /**
   * Create user
   */
  async createUser(userData) {
    return this.request("/users", {
      method: "POST",
      body: userData,
    });
  },

  /**
   * Update user
   */
  async updateUser(id, userData) {
    return this.request(`/users/${id}`, {
      method: "PUT",
      body: userData,
    });
  },

  /**
   * Delete user
   */
  async deleteUser(id) {
    return this.request(`/users/${id}`, { method: "DELETE" });
  },

  // ==================== AUDIT ====================

  /**
   * Get audit logs
   */
  async getAuditLogs(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/audit${query ? `?${query}` : ""}`);
  },

  /**
   * Get security logs
   */
  async getSecurityLogs(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/audit/security${query ? `?${query}` : ""}`);
  },

  /**
   * Get audit stats
   */
  async getAuditStats() {
    return this.request("/audit/stats");
  },

  // ==================== KNOWLEDGE BASE ====================

  /**
   * List KB documents
   */
  async getKBDocuments(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/kb${query ? `?${query}` : ""}`);
  },

  /**
   * Get KB stats
   */
  async getKBStats() {
    return this.request("/kb/stats");
  },

  /**
   * Get single KB document
   */
  async getKBDocument(id) {
    return this.request(`/kb/${id}`);
  },

  /**
   * Create KB document
   */
  async createKBDocument(docData) {
    return this.request("/kb", {
      method: "POST",
      body: docData,
    });
  },

  /**
   * Update KB document
   */
  async updateKBDocument(id, docData) {
    return this.request(`/kb/${id}`, {
      method: "PUT",
      body: docData,
    });
  },

  /**
   * Delete KB document
   */
  async deleteKBDocument(id) {
    return this.request(`/kb/${id}`, { method: "DELETE" });
  },

  // ==================== DASHBOARD ====================

  /**
   * Get dashboard stats
   */
  async getDashboardStats() {
    return this.request("/dashboard/stats");
  },

  // ==================== HEALTH ====================

  /**
   * Health check
   */
  async health() {
    return this.request("/health");
  },
};

// Export for global access
window.API = API;
