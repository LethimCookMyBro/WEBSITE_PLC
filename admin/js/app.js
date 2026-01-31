/**
 * PANYA Admin Dashboard
 * PLC Technical Support Management System
 */

const App = {
  API_URL: "http://localhost:3001/api",
  charts: {},

  async init() {
    this.showDate();
    this.bindEvents();
    await this.loadStats();
    await this.loadLeads();
    await this.loadTickets();
    await this.loadTopIssues();
    this.initCharts();
  },

  // Show current date
  showDate() {
    const options = { day: "numeric", month: "short", year: "numeric" };
    document.getElementById("currentDate").textContent =
      `— ${new Date().toLocaleDateString("th-TH", options)}`;
  },

  // API Request
  async api(endpoint) {
    try {
      const res = await fetch(`${this.API_URL}${endpoint}`);
      return await res.json();
    } catch (err) {
      console.error("API Error:", err);
      return null;
    }
  },

  // Bind Events
  bindEvents() {
    // Logout
    document.getElementById("logoutBtn")?.addEventListener("click", () => {
      if (confirm("ต้องการออกจากระบบ?")) {
        window.location.href = "login.html";
      }
    });

    // Refresh
    document.getElementById("refreshBtn")?.addEventListener("click", () => {
      location.reload();
    });

    // Export Leads
    document.getElementById("exportLeadsBtn")?.addEventListener("click", () => {
      this.exportLeads();
    });

    // Contact Lead
    document.getElementById("contactLeadBtn")?.addEventListener("click", () => {
      alert("เปิดหน้าโทรหาลูกค้า");
      this.closeModal();
    });

    // Close Modal
    document.querySelectorAll(".modal__close").forEach((btn) => {
      btn.addEventListener("click", () => this.closeModal());
    });

    // Sidebar navigation
    document.querySelectorAll(".sidebar__link").forEach((link) => {
      link.addEventListener("click", (e) => {
        document
          .querySelectorAll(".sidebar__link")
          .forEach((l) => l.classList.remove("sidebar__link--active"));
        e.currentTarget.classList.add("sidebar__link--active");
        const section = e.currentTarget.dataset.section;
        if (section) {
          document
            .getElementById(section)
            ?.scrollIntoView({ behavior: "smooth" });
        }
      });
    });
  },

  // Load Dashboard Stats
  async loadStats() {
    const data = await this.api("/dashboard/stats");
    if (data) {
      document.getElementById("statQueries").textContent =
        data.totalQueries || "247";
      document.getElementById("statResolved").textContent =
        `${data.resolvedRate || 94}%`;
      document.getElementById("statLeads").textContent = data.newLeads || "12";
      document.getElementById("statAvgTime").textContent =
        `${data.avgTime || 1.2}s`;
      document.getElementById("leadsBadge").textContent = data.newLeads || "0";
    } else {
      // Demo data
      document.getElementById("statQueries").textContent = "247";
      document.getElementById("statResolved").textContent = "94%";
      document.getElementById("statLeads").textContent = "12";
      document.getElementById("statAvgTime").textContent = "1.2s";
      document.getElementById("leadsBadge").textContent = "12";
    }
  },

  // Load Leads from Contact Form
  async loadLeads() {
    const container = document.getElementById("leadsList");
    const data = await this.api("/leads?limit=10");

    if (!data?.leads?.length) {
      // Demo leads
      const demoLeads = [
        {
          id: 1,
          name: "สมชาย ใจดี",
          company: "บริษัท ไทยออโต้ จำกัด",
          position: "วิศวกรบำรุงรักษา",
          email: "somchai@auto.co.th",
          phone: "081-234-5678",
          message: "สนใจระบบ PANYA สำหรับ PLC Mitsubishi FX5U",
          created_at: new Date(),
        },
        {
          id: 2,
          name: "นงลักษณ์ วงษ์สุข",
          company: "โรงงานผลิตชิ้นส่วน ABC",
          position: "ผู้จัดการโรงงาน",
          email: "nonglak@abc.co.th",
          phone: "089-876-5432",
          message: "ต้องการลดเวลา downtime จากการแก้ปัญหา PLC",
          created_at: new Date(Date.now() - 3600000),
        },
        {
          id: 3,
          name: "วิชัย เจริญผล",
          company: "XYZ Manufacturing",
          position: "Maintenance Engineer",
          email: "wichai@xyz.com",
          phone: "062-333-4444",
          message: "ขอใบเสนอราคาแพ็คเกจ Enterprise",
          created_at: new Date(Date.now() - 7200000),
        },
      ];

      container.innerHTML = demoLeads
        .map(
          (lead) => `
        <div class="list-item" onclick="App.showLeadDetail(${JSON.stringify(lead).replace(/"/g, "&quot;")})">
          <div class="list-item__avatar">${lead.name.charAt(0)}</div>
          <div class="list-item__content">
            <p class="list-item__title">${lead.name} — ${lead.company}</p>
            <p class="list-item__subtitle">${lead.message}</p>
          </div>
          <div>
            <span class="badge badge--new">ใหม่</span>
            <p class="list-item__time">${this.timeAgo(lead.created_at)}</p>
          </div>
        </div>
      `,
        )
        .join("");
      return;
    }

    container.innerHTML = data.leads
      .map(
        (lead) => `
      <div class="list-item" onclick="App.showLeadDetail('${lead.id}')">
        <div class="list-item__avatar">${lead.name?.charAt(0) || "L"}</div>
        <div class="list-item__content">
          <p class="list-item__title">${lead.name} — ${lead.company}</p>
          <p class="list-item__subtitle">${lead.message}</p>
        </div>
        <div>
          <span class="badge badge--new">ใหม่</span>
          <p class="list-item__time">${this.timeAgo(lead.created_at)}</p>
        </div>
      </div>
    `,
      )
      .join("");
  },

  // Load Tickets
  async loadTickets() {
    const container = document.getElementById("ticketsList");

    // Demo tickets matching PLC Support context
    const demoTickets = [
      {
        id: 1,
        title: "FX5U ไม่สามารถเชื่อมต่อ Ethernet",
        customer: "บริษัท ซุปเปอร์แมช",
        priority: "high",
        status: "pending",
        created_at: new Date(),
      },
      {
        id: 2,
        title: "Q03UDE ค้างที่ RUN mode",
        customer: "โรงงานอาหาร เฟรชฟู้ด",
        priority: "medium",
        status: "resolved",
        created_at: new Date(Date.now() - 1800000),
      },
      {
        id: 3,
        title: "Error Code 3205 บน GT2710",
        customer: "บริษัท ไทยพลาสติก",
        priority: "low",
        status: "pending",
        created_at: new Date(Date.now() - 5400000),
      },
    ];

    container.innerHTML = demoTickets
      .map(
        (ticket) => `
      <div class="list-item" onclick="App.viewTicket('${ticket.id}')">
        <div class="list-item__avatar"><i class="fas fa-ticket-alt"></i></div>
        <div class="list-item__content">
          <p class="list-item__title">${ticket.title}</p>
          <p class="list-item__subtitle">${ticket.customer}</p>
        </div>
        <div>
          <span class="badge badge--${ticket.status}">${ticket.status === "pending" ? "รอดำเนินการ" : "แก้ไขแล้ว"}</span>
          <p class="list-item__time">${this.timeAgo(ticket.created_at)}</p>
        </div>
      </div>
    `,
      )
      .join("");
  },

  // Load Top PLC Issues
  async loadTopIssues() {
    const container = document.getElementById("issuesList");

    // Demo top issues for PLC Support
    const issues = [
      {
        rank: 1,
        title: "Communication Timeout Error",
        brand: "Mitsubishi FX5U",
        count: 142,
        trend: "+12%",
      },
      {
        rank: 2,
        title: "Memory Overflow",
        brand: "Mitsubishi Q Series",
        count: 98,
        trend: "+5%",
      },
      {
        rank: 3,
        title: "I/O Configuration Error",
        brand: "Siemens S7-1200",
        count: 67,
        trend: "-3%",
      },
      {
        rank: 4,
        title: "Parameter Access Failure",
        brand: "Omron CP1H",
        count: 45,
        trend: "+8%",
      },
      {
        rank: 5,
        title: "Network Disconnection",
        brand: "Allen Bradley",
        count: 32,
        trend: "-1%",
      },
    ];

    container.innerHTML = issues
      .map(
        (issue) => `
      <div class="issue-item">
        <div class="issue-item__rank ${issue.rank <= 3 ? "issue-item__rank--" + issue.rank : ""}">#${issue.rank}</div>
        <div>
          <p class="issue-item__title">${issue.title}</p>
        </div>
        <p class="issue-item__brand">${issue.brand}</p>
        <p class="issue-item__count">${issue.count} ครั้ง</p>
        <span class="badge ${issue.trend.startsWith("+") ? "badge--pending" : "badge--resolved"}">${issue.trend}</span>
      </div>
    `,
      )
      .join("");
  },

  // Initialize Charts
  initCharts() {
    this.initQuestionsChart();
    this.initCategoriesChart();
  },

  // Questions Trend Chart
  initQuestionsChart() {
    const ctx = document.getElementById("questionsChart");
    if (!ctx) return;

    this.charts.questions = new Chart(ctx, {
      type: "line",
      data: {
        labels: [
          "จันทร์",
          "อังคาร",
          "พุธ",
          "พฤหัส",
          "ศุกร์",
          "เสาร์",
          "อาทิตย์",
        ],
        datasets: [
          {
            label: "คำถามทั้งหมด",
            data: [45, 62, 58, 71, 56, 32, 28],
            borderColor: "#3b82f6",
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            fill: true,
            tension: 0.4,
            pointBackgroundColor: "#3b82f6",
          },
          {
            label: "AI แก้ได้",
            data: [42, 58, 54, 68, 52, 30, 26],
            borderColor: "#22c55e",
            backgroundColor: "rgba(34, 197, 94, 0.1)",
            fill: true,
            tension: 0.4,
            pointBackgroundColor: "#22c55e",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: { color: "#94a3b8", usePointStyle: true, padding: 16 },
          },
        },
        scales: {
          x: {
            grid: { color: "rgba(255,255,255,0.05)" },
            ticks: { color: "#94a3b8" },
          },
          y: {
            grid: { color: "rgba(255,255,255,0.05)" },
            ticks: { color: "#94a3b8" },
            beginAtZero: true,
          },
        },
      },
    });
  },

  // Categories Pie Chart
  initCategoriesChart() {
    const ctx = document.getElementById("categoriesChart");
    if (!ctx) return;

    this.charts.categories = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Communication", "Memory", "I/O", "Network", "อื่นๆ"],
        datasets: [
          {
            data: [35, 25, 20, 12, 8],
            backgroundColor: [
              "#3b82f6",
              "#22c55e",
              "#f59e0b",
              "#8b5cf6",
              "#64748b",
            ],
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "65%",
        plugins: {
          legend: {
            position: "right",
            labels: {
              color: "#94a3b8",
              usePointStyle: true,
              padding: 12,
              font: { size: 11 },
            },
          },
        },
      },
    });
  },

  // Show Lead Detail
  showLeadDetail(lead) {
    const detail = document.getElementById("leadDetail");

    if (typeof lead === "string") {
      // ID passed, fetch from API
      detail.innerHTML = '<div class="loading">กำลังโหลด...</div>';
      this.openModal("leadModal");
      return;
    }

    detail.innerHTML = `
      <div class="lead-detail">
        <div class="lead-detail__row"><span class="lead-detail__label">ชื่อ:</span><span class="lead-detail__value">${lead.name}</span></div>
        <div class="lead-detail__row"><span class="lead-detail__label">ตำแหน่ง:</span><span class="lead-detail__value">${lead.position}</span></div>
        <div class="lead-detail__row"><span class="lead-detail__label">บริษัท:</span><span class="lead-detail__value">${lead.company}</span></div>
        <div class="lead-detail__row"><span class="lead-detail__label">อีเมล:</span><span class="lead-detail__value">${lead.email}</span></div>
        <div class="lead-detail__row"><span class="lead-detail__label">โทรศัพท์:</span><span class="lead-detail__value">${lead.phone}</span></div>
        <div class="lead-detail__label" style="margin-top: 12px">รายละเอียด:</div>
        <div class="lead-detail__message">${lead.message}</div>
      </div>
    `;
    this.openModal("leadModal");
  },

  // View Ticket
  viewTicket(id) {
    alert(`เปิด Ticket #${id}\n(ฟีเจอร์กำลังพัฒนา)`);
  },

  // Export Leads
  exportLeads() {
    alert("กำลัง Export รายชื่อลูกค้าเป็น CSV...");
    // In real implementation, this would download a CSV file
  },

  // Modal
  openModal(id) {
    document.getElementById(id)?.classList.add("modal--open");
  },

  closeModal() {
    document
      .querySelectorAll(".modal")
      .forEach((m) => m.classList.remove("modal--open"));
  },

  // Time Ago
  timeAgo(date) {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins} นาทีที่แล้ว`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} ชั่วโมงที่แล้ว`;
    return `${Math.floor(hours / 24)} วันที่แล้ว`;
  },
};

// Initialize
document.addEventListener("DOMContentLoaded", () => App.init());
