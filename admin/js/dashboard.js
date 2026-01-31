/**
 * PANYA Admin - Dashboard Module
 * Handles dashboard interactivity, charts, and real-time data
 */

const Dashboard = {
  /**
   * Initialize dashboard
   */
  async init() {
    // Check auth first
    const user = await Auth.checkSession();
    if (!user) return;

    this.user = user;
    this.loadUserInfo();
    this.initSidebar();
    this.applyPermissions();
    this.bindEvents();

    // Load real data
    await this.loadDashboardData();
    await this.initCharts();
  },

  /**
   * Load user info into UI
   */
  loadUserInfo() {
    const userAvatar = document.getElementById("userAvatar");
    const userName = document.getElementById("userName");
    const userRole = document.getElementById("userRole");

    if (userAvatar) userAvatar.textContent = this.user.avatar || "U";
    if (userName) userName.textContent = this.user.name;
    if (userRole) userRole.textContent = this.capitalizeRole(this.user.role);
  },

  /**
   * Capitalize role name
   */
  capitalizeRole(role) {
    return role ? role.charAt(0).toUpperCase() + role.slice(1) : "";
  },

  /**
   * Load dashboard statistics from API
   */
  async loadDashboardData() {
    try {
      const stats = await API.getDashboardStats();
      this.updateStatsCards(stats);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
      // Show fallback data
      this.updateStatsCards({
        moneySaved: 0,
        totalQueries: 0,
        successRate: 0,
        kbDocuments: 0,
      });
    }
  },

  /**
   * Update stats cards with real data
   */
  updateStatsCards(stats) {
    // Money Saved
    const moneySavedEl = document.querySelector(
      '[data-stat="money-saved"] .stat-card__value',
    );
    if (moneySavedEl) {
      moneySavedEl.textContent = this.formatCurrency(stats.moneySaved || 0);
    }

    // Total Queries
    const queriesEl = document.querySelector(
      '[data-stat="total-queries"] .stat-card__value',
    );
    if (queriesEl) {
      queriesEl.textContent = this.formatNumber(stats.totalQueries || 0);
    }

    // Success Rate
    const successEl = document.querySelector(
      '[data-stat="success-rate"] .stat-card__value',
    );
    if (successEl) {
      successEl.textContent = `${stats.successRate || 0}%`;
    }

    // KB Documents / Active Users
    const kbEl = document.querySelector(
      '[data-stat="kb-docs"] .stat-card__value',
    );
    if (kbEl) {
      kbEl.textContent = this.formatNumber(stats.kbDocuments || 0);
    }
  },

  /**
   * Format number with commas
   */
  formatNumber(num) {
    return new Intl.NumberFormat().format(num);
  },

  /**
   * Format currency
   */
  formatCurrency(num) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(num);
  },

  /**
   * Initialize sidebar behavior
   */
  initSidebar() {
    const sidebar = document.getElementById("sidebar");
    const sidebarToggle = document.getElementById("sidebarToggle");
    const mobileToggle = document.getElementById("mobileMenuToggle");
    const overlay = document.getElementById("sidebarOverlay");
    const mainContent = document.querySelector(".admin-main");

    // Desktop collapse toggle
    sidebarToggle?.addEventListener("click", () => {
      sidebar.classList.toggle("admin-sidebar--collapsed");
      mainContent?.classList.toggle("admin-main--collapsed");

      const isCollapsed = sidebar.classList.contains(
        "admin-sidebar--collapsed",
      );
      localStorage.setItem("sidebar_collapsed", isCollapsed);
    });

    // Load saved preference
    if (localStorage.getItem("sidebar_collapsed") === "true") {
      sidebar?.classList.add("admin-sidebar--collapsed");
      mainContent?.classList.add("admin-main--collapsed");
    }

    // Mobile menu toggle
    mobileToggle?.addEventListener("click", () => {
      sidebar.classList.toggle("admin-sidebar--open");
    });

    // Close on overlay click
    overlay?.addEventListener("click", () => {
      sidebar.classList.remove("admin-sidebar--open");
    });

    // Close on escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        sidebar.classList.remove("admin-sidebar--open");
      }
    });
  },

  /**
   * Apply role-based permissions to sidebar
   */
  applyPermissions() {
    const role = this.user.role;

    // Define permissions
    const rolePermissions = {
      admin: ["admin", "engineer", "viewer"],
      engineer: ["engineer", "viewer"],
      viewer: ["viewer"],
    };

    const userPermissions = rolePermissions[role] || [];

    // Hide sections based on permissions
    document.querySelectorAll("[data-permission]").forEach((el) => {
      const required = el.dataset.permission;
      if (!userPermissions.includes(required)) {
        el.style.display = "none";
      }
    });
  },

  // Store chart instance to prevent duplicates
  chartInstance: null,
  chartInitialized: false,

  /**
   * Initialize Chart.js charts with real data
   */
  async initCharts() {
    // Only initialize once
    if (this.chartInitialized) return;
    this.chartInitialized = true;

    await this.initQueryChart();
  },

  /**
   * Initialize Query Trends Chart
   */
  async initQueryChart() {
    const ctx = document.getElementById("queryChart");
    if (!ctx) return;

    // Destroy existing chart if any
    if (this.chartInstance) {
      this.chartInstance.destroy();
      this.chartInstance = null;
    }

    // Try to get real data from audit logs
    let chartData;
    try {
      const auditStats = await API.getAuditStats();
      chartData = this.processChartData(auditStats);
    } catch (error) {
      console.log("Using mock chart data");
      chartData = this.getMockChartData();
    }

    // Create chart and store instance
    this.chartInstance = new Chart(ctx, {
      type: "line",
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: true,
        animation: {
          duration: 500, // Reduce animation for better performance
        },
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              color: "#9ca3af",
              usePointStyle: true,
              padding: 20,
            },
          },
        },
        scales: {
          x: {
            grid: { color: "rgba(255, 255, 255, 0.05)" },
            ticks: { color: "#9ca3af" },
          },
          y: {
            grid: { color: "rgba(255, 255, 255, 0.05)" },
            ticks: { color: "#9ca3af" },
            beginAtZero: true,
          },
        },
      },
    });
  },

  /**
   * Process audit stats for chart
   */
  processChartData(auditStats) {
    const labels = auditStats.dailyStats?.map((d) => d.date) || [];
    const data = auditStats.dailyStats?.map((d) => d.count) || [];

    return {
      labels: labels.length
        ? labels
        : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [
        {
          label: "Total Activity",
          data: data.length ? data : [245, 312, 287, 356, 298, 189, 160],
          borderColor: "#3b82f6",
          backgroundColor: "rgba(59, 130, 246, 0.1)",
          fill: true,
          tension: 0.4,
        },
      ],
    };
  },

  /**
   * Get mock chart data
   */
  getMockChartData() {
    return {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [
        {
          label: "Total Queries",
          data: [245, 312, 287, 356, 298, 189, 160],
          borderColor: "#3b82f6",
          backgroundColor: "rgba(59, 130, 246, 0.1)",
          fill: true,
          tension: 0.4,
        },
        {
          label: "AI Resolved",
          data: [230, 295, 268, 340, 280, 178, 152],
          borderColor: "#22c55e",
          backgroundColor: "rgba(34, 197, 94, 0.1)",
          fill: true,
          tension: 0.4,
        },
        {
          label: "Escalated",
          data: [15, 17, 19, 16, 18, 11, 8],
          borderColor: "#f59e0b",
          backgroundColor: "rgba(245, 158, 11, 0.1)",
          fill: true,
          tension: 0.4,
        },
      ],
    };
  },

  /**
   * Bind UI events
   */
  bindEvents() {
    // User menu logout
    const userMenu = document.getElementById("userMenu");
    userMenu?.addEventListener("click", async () => {
      if (confirm("คุณต้องการออกจากระบบหรือไม่?")) {
        await Auth.logout();
      }
    });

    // Table sorting
    document.querySelectorAll(".admin-table th.sortable").forEach((th) => {
      th.addEventListener("click", () => {
        this.handleSort(th);
      });
    });

    // Refresh data every 30 seconds
    setInterval(() => {
      this.loadDashboardData();
    }, 30000);
  },

  /**
   * Handle table sorting
   */
  handleSort(th) {
    const table = th.closest("table");
    const headerRow = th.parentElement;
    const columnIndex = Array.from(headerRow.children).indexOf(th);
    const tbody = table.querySelector("tbody");
    const rows = Array.from(tbody.querySelectorAll("tr"));

    headerRow.querySelectorAll("th").forEach((cell) => {
      if (cell !== th) {
        cell.classList.remove("sorted-asc", "sorted-desc");
      }
    });

    const isAsc = th.classList.contains("sorted-asc");
    th.classList.remove("sorted-asc", "sorted-desc");
    th.classList.add(isAsc ? "sorted-desc" : "sorted-asc");

    rows.sort((a, b) => {
      const aVal = a.children[columnIndex].textContent.trim();
      const bVal = b.children[columnIndex].textContent.trim();
      return isAsc ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal);
    });

    rows.forEach((row) => tbody.appendChild(row));
  },
};

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  Dashboard.init();
});

// Export for global access
window.Dashboard = Dashboard;
