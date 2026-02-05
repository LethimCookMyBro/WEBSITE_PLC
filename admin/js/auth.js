/**
 * PANYA Admin - Authentication Module
 * Handles login form and session management
 */

const Auth = {
  /**
   * Initialize auth module
   */
  init() {
    this.bindLoginForm();
    this.bindPasswordToggle();
  },

  /**
   * Bind login form submission
   */
  bindLoginForm() {
    const form = document.getElementById("loginForm");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      await this.handleLogin(form);
    });
  },

  /**
   * Handle login form submission
   */
  async handleLogin(form) {
    const email = form.querySelector("#email").value.trim();
    const password = form.querySelector("#password").value;
    const remember = form.querySelector("#remember")?.checked || false;
    const errorEl = document.getElementById("loginError");
    const submitBtn = form.querySelector('button[type="submit"]');

    // Validate
    if (!email || !password) {
      this.showError(errorEl, "กรุณากรอกอีเมลและรหัสผ่าน");
      return;
    }

    // Disable button and show loading
    submitBtn.disabled = true;
    submitBtn.innerHTML =
      '<i class="fas fa-spinner fa-spin"></i> กำลังเข้าสู่ระบบ...';

    try {
      // Call real API
      const data = await API.login(email, password, remember);

      if (data.token && data.user) {
        // Redirect based on role
        window.location.href = "index.html";
      }
    } catch (error) {
      this.showError(errorEl, error.message || "อีเมลหรือรหัสผ่านไม่ถูกต้อง");
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'เข้าสู่ระบบ <i class="fas fa-arrow-right"></i>';
    }
  },

  /**
   * Show error message
   */
  showError(errorEl, message) {
    if (!errorEl) return;
    errorEl.textContent = message;
    errorEl.style.display = "block";

    // Auto hide after 5 seconds
    setTimeout(() => {
      errorEl.style.display = "none";
    }, 5000);
  },

  /**
   * Bind password visibility toggle
   */
  bindPasswordToggle() {
    const toggleBtn = document.getElementById("togglePassword");
    const passwordInput = document.getElementById("password");

    if (!toggleBtn || !passwordInput) return;

    toggleBtn.addEventListener("click", () => {
      const type = passwordInput.type === "password" ? "text" : "password";
      passwordInput.type = type;
      toggleBtn.querySelector("i").className =
        type === "password" ? "fas fa-eye" : "fas fa-eye-slash";
    });
  },

  /**
   * Check if user is logged in
   */
  isLoggedIn() {
    return !!API.getToken();
  },

  /**
   * Get current session
   */
  getSession() {
    return API.getUser();
  },

  /**
   * Logout user
   */
  async logout() {
    await API.logout();
  },

  /**
   * Check session and redirect if needed
   */
  async checkSession() {
    if (!this.isLoggedIn()) {
      if (!window.location.pathname.includes("login")) {
        window.location.href = "login.html";
      }
      return null;
    }

    try {
      // Verify token is still valid
      const user = await API.me();
      return user;
    } catch (error) {
      console.error("Session invalid:", error);
      API.clearToken();
      if (!window.location.pathname.includes("login")) {
        window.location.href = "login.html";
      }
      return null;
    }
  },
};

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  Auth.init();
});

// Export for global access
window.Auth = Auth;
