/**
 * Admin Dashboard JavaScript
 * Handles data loading, rendering, and UI interactions
 */

// Global leads data
let leads = [];

// ============================================
// Data Loading Functions
// ============================================

async function loadLeads() {
  try {
    const result = await API.getLeads({ limit: 50 });
    leads = result.leads || [];
    renderLeads();
    updateStats();
    document.getElementById("leadsBadge").textContent = leads.filter(
      (l) => l.status === "new" || !l.status
    ).length;
  } catch (error) {
    console.error("Failed to load leads:", error);
    leads = [];
    renderLeads();
  }
}

async function loadAuditLogs() {
  const container = document.getElementById("auditLogsList");
  try {
    const result = await API.getAuditLogs({ limit: 10 });
    const logs = result.logs || [];
    if (logs.length === 0) {
      container.innerHTML = renderEmptyState("fa-history", "ไม่มี Audit Logs");
      return;
    }
    container.innerHTML = logs.map((log) => `
      <div class="list-item">
        <div class="list-item__avatar"><i class="fas fa-user-cog"></i></div>
        <div class="list-item__content">
          <p class="list-item__title">${log.action || log.type || "Activity"}</p>
          <p class="list-item__subtitle">${log.user || "System"} - ${log.details || ""}</p>
        </div>
        <p class="list-item__time">${formatTime(log.created_at)}</p>
      </div>
    `).join("");
  } catch (error) {
    container.innerHTML = renderEmptyState("fa-history", "ไม่มี Audit Logs");
  }
}

async function loadSecurityLogs() {
  const container = document.getElementById("securityLogsList");
  try {
    const result = await API.getSecurityLogs({ limit: 10 });
    const logs = result.logs || [];
    if (logs.length === 0) {
      container.innerHTML = renderEmptyState("fa-shield-alt", "ไม่มี Security Logs");
      return;
    }
    container.innerHTML = logs.map((log) => {
      const bgColor = log.success ? "rgba(34, 197, 94, 0.2)" : "rgba(239, 68, 68, 0.2)";
      const textColor = log.success ? "#22c55e" : "#ef4444";
      const icon = log.success ? "fa-check" : "fa-times";
      return `
        <div class="list-item">
          <div class="list-item__avatar" style="background: ${bgColor}; color: ${textColor}">
            <i class="fas ${icon}"></i>
          </div>
          <div class="list-item__content">
            <p class="list-item__title">${log.action || "Login Attempt"}</p>
            <p class="list-item__subtitle">IP: ${log.ip || "Unknown"} - ${log.user || "Unknown User"}</p>
          </div>
          <p class="list-item__time">${formatTime(log.created_at)}</p>
        </div>
      `;
    }).join("");
  } catch (error) {
    container.innerHTML = renderEmptyState("fa-shield-alt", "ไม่มี Security Logs");
  }
}

function loadServerLogs() {
  const container = document.getElementById("serverLogsList");
  const logs = [
    { type: "info", message: "Server started on port 3000", time: new Date(Date.now() - 3600000).toISOString() },
    { type: "info", message: "Database connected successfully", time: new Date(Date.now() - 3500000).toISOString() },
    { type: "success", message: "API routes initialized", time: new Date(Date.now() - 3400000).toISOString() },
  ];

  container.innerHTML = logs.map((log) => {
    const iconColor = log.type === "error" ? "#ef4444" : log.type === "warning" ? "#f59e0b" : "#22c55e";
    const icon = log.type === "error" ? "fa-times-circle" : log.type === "warning" ? "fa-exclamation-circle" : "fa-check-circle";
    return `
      <div class="list-item">
        <div class="list-item__avatar" style="background: ${iconColor}20; color: ${iconColor}">
          <i class="fas ${icon}"></i>
        </div>
        <div class="list-item__content">
          <p class="list-item__title">${log.message}</p>
          <p class="list-item__subtitle">[${log.type.toUpperCase()}]</p>
        </div>
        <p class="list-item__time">${formatTime(log.time)}</p>
      </div>
    `;
  }).join("");
}

// ============================================
// Rendering Functions
// ============================================

function renderLeads() {
  const container = document.getElementById("leadsList");
  if (leads.length === 0) {
    container.innerHTML = renderEmptyState("fa-inbox", "ยังไม่มีลูกค้าที่สนใจ");
    return;
  }

  container.innerHTML = leads.map((l, i) => {
    const time = l.created_at ? formatTime(l.created_at) : "ไม่ทราบ";
    const status = l.status || "new";
    const badgeClass = status === "new" ? "new" : status === "contacted" ? "pending" : "resolved";
    const badgeText = status === "new" ? "ใหม่" : status === "contacted" ? "ติดต่อแล้ว" : "เสร็จสิ้น";

    return `
      <div class="list-item" onclick="showLead(${i})">
        <div class="list-item__avatar">${l.name ? l.name.charAt(0) : "?"}</div>
        <div class="list-item__content">
          <p class="list-item__title">${l.name || "ไม่ระบุชื่อ"} — ${l.company || "ไม่ระบุบริษัท"}</p>
          <p class="list-item__subtitle">${l.message || "ไม่มีข้อความ"}</p>
        </div>
        <div>
          <span class="badge badge--${badgeClass}">${badgeText}</span>
          <p class="list-item__time">${time}</p>
        </div>
      </div>
    `;
  }).join("");
}

function renderEmptyState(icon, message) {
  return `
    <div class="empty-state">
      <i class="fas ${icon} empty-state__icon"></i>
      ${message}
    </div>
  `;
}

function updateStats() {
  const total = leads.length;
  const today = new Date().toISOString().split("T")[0];
  const newToday = leads.filter((l) => l.created_at && l.created_at.startsWith(today)).length;
  const pending = leads.filter((l) => l.status === "new" || !l.status).length;
  const contacted = leads.filter((l) => l.status === "contacted").length;

  document.getElementById("statTotalLeads").textContent = total;
  document.getElementById("statNewToday").textContent = newToday;
  document.getElementById("statPending").textContent = pending;
  document.getElementById("statContacted").textContent = contacted;
}

// ============================================
// Utility Functions
// ============================================

function formatTime(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000 / 60); // minutes

  if (diff < 1) return "เมื่อกี้";
  if (diff < 60) return `${diff} นาทีที่แล้ว`;
  if (diff < 1440) return `${Math.floor(diff / 60)} ชั่วโมงที่แล้ว`;
  return `${Math.floor(diff / 1440)} วันที่แล้ว`;
}

// ============================================
// Modal Functions
// ============================================

function showLead(i) {
  const l = leads[i];
  if (!l) return;

  document.getElementById("leadDetail").innerHTML = `
    <div class="lead-detail">
      <div class="lead-detail__row"><span class="lead-detail__label">ชื่อ:</span><span class="lead-detail__value">${l.name || "-"}</span></div>
      <div class="lead-detail__row"><span class="lead-detail__label">ตำแหน่ง:</span><span class="lead-detail__value">${l.position || "-"}</span></div>
      <div class="lead-detail__row"><span class="lead-detail__label">บริษัท:</span><span class="lead-detail__value">${l.company || "-"}</span></div>
      <div class="lead-detail__row"><span class="lead-detail__label">อีเมล:</span><span class="lead-detail__value">${l.email || "-"}</span></div>
      <div class="lead-detail__row"><span class="lead-detail__label">โทร:</span><span class="lead-detail__value">${l.phone || "-"}</span></div>
      <div class="lead-detail__message">${l.message || "ไม่มีข้อความ"}</div>
    </div>
  `;
  document.getElementById("leadModal").classList.add("modal--open");
}

function closeModal() {
  document.getElementById("leadModal").classList.remove("modal--open");
}

// ============================================
// Export Functions
// ============================================

function exportLeads() {
  if (leads.length === 0) {
    alert("ไม่มีข้อมูลลูกค้าให้ Export");
    return;
  }

  const headers = ["ชื่อ", "ตำแหน่ง", "บริษัท", "อีเมล", "โทร", "ข้อความ", "สถานะ", "วันที่"];
  const rows = leads.map((l) => [
    l.name || "",
    l.position || "",
    l.company || "",
    l.email || "",
    l.phone || "",
    (l.message || "").replace(/,/g, ";"),
    l.status || "new",
    l.created_at || "",
  ]);

  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `leads_${new Date().toISOString().split("T")[0]}.csv`;
  link.click();
}

// ============================================
// Initialize Dashboard
// ============================================

function initDashboard() {
  loadLeads();
  loadAuditLogs();
  loadSecurityLogs();
  loadServerLogs();
}

// Auto-initialize when DOM is ready
document.addEventListener("DOMContentLoaded", initDashboard);
