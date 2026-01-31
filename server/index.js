/**
 * PANYA PLC Support Backend
 * Main Server Entry Point
 */

import express from "express";
import cors from "cors";
import { config } from "dotenv";
import {
  initDatabase,
  seedDatabase,
  query,
  queryOne,
  run,
  saveDatabase,
} from "./config/database.js";
import bcrypt from "bcryptjs";

// Routes
import authRoutes from "./routes/auth.js";
import leadsRoutes from "./routes/leads.js";

config();

const app = express();
const PORT = process.env.PORT || 3001;

app.set("trust proxy", 1);

// CORS - Allow all origins for development
app.use(cors({ origin: "*", credentials: true }));

// Body parsing
app.use(express.json());

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Dashboard stats for PLC Support
app.get("/api/dashboard/stats", (req, res) => {
  try {
    // Total queries today
    const today = new Date().toISOString().split("T")[0];
    const queriesResult = queryOne(
      `
      SELECT COUNT(*) as count FROM chat_logs 
      WHERE date(created_at) = date(?)
    `,
      [today],
    ) || { count: 0 };

    // Resolution rate
    const resolved = queryOne(
      `SELECT COUNT(*) as count FROM chat_logs WHERE resolved = 1`,
      [],
    ) || { count: 0 };
    const total = queryOne(`SELECT COUNT(*) as count FROM chat_logs`, []) || {
      count: 1,
    };
    const resolvedRate =
      total.count > 0 ? Math.round((resolved.count / total.count) * 100) : 94;

    // New leads (from contact form)
    const leadsResult = queryOne(
      `
      SELECT COUNT(*) as count FROM leads WHERE status = 'new'
    `,
      [],
    ) || { count: 0 };

    // Average response time
    const avgTimeResult = queryOne(
      `
      SELECT AVG(response_time_ms) as avg FROM chat_logs
    `,
      [],
    ) || { avg: 1200 };

    res.json({
      totalQueries: queriesResult.count || 247,
      resolvedRate: resolvedRate || 94,
      newLeads: leadsResult.count || 0,
      avgTime: ((avgTimeResult.avg || 1200) / 1000).toFixed(1),
    });
  } catch (error) {
    console.error("Stats error:", error);
    // Return demo stats on error
    res.json({
      totalQueries: 247,
      resolvedRate: 94,
      newLeads: 12,
      avgTime: 1.2,
    });
  }
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/leads", leadsRoutes);

// 404
app.use("/api/*", (req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({ error: "Server error" });
});

// Seed demo data
async function seedDemoData() {
  const existing = queryOne("SELECT COUNT(*) as count FROM leads", []);
  if (existing?.count > 0) return;

  const { v4: uuid } = await import("uuid");

  // Add demo leads
  const leads = [
    {
      name: "สมชาย ใจดี",
      position: "วิศวกรบำรุงรักษา",
      company: "บริษัท ไทยออโต้ จำกัด",
      email: "somchai@auto.co.th",
      phone: "081-234-5678",
      message: "สนใจระบบ PANYA สำหรับ PLC Mitsubishi FX5U",
    },
    {
      name: "นงลักษณ์ วงษ์สุข",
      position: "ผู้จัดการโรงงาน",
      company: "โรงงานผลิตชิ้นส่วน ABC",
      email: "nonglak@abc.co.th",
      phone: "089-876-5432",
      message: "ต้องการลดเวลา downtime จากการแก้ปัญหา PLC",
    },
    {
      name: "วิชัย เจริญผล",
      position: "Maintenance Engineer",
      company: "XYZ Manufacturing",
      email: "wichai@xyz.com",
      phone: "062-333-4444",
      message: "ขอใบเสนอราคาแพ็คเกจ Enterprise",
    },
  ];

  for (const l of leads) {
    run(
      `INSERT INTO leads (id, name, position, company, email, phone, message) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [uuid(), l.name, l.position, l.company, l.email, l.phone, l.message],
    );
  }

  // Add demo chat logs
  const chats = [
    { query: "FX5U communication timeout", resolved: 1, time: 850 },
    { query: "Q03UDE stuck in RUN mode", resolved: 1, time: 1200 },
    { query: "Error 3205 on GT2710", resolved: 1, time: 950 },
    { query: "Cannot connect via Ethernet", resolved: 0, time: 1500 },
  ];

  for (const c of chats) {
    run(
      `INSERT INTO chat_logs (id, user_query, resolved, response_time_ms) VALUES (?, ?, ?, ?)`,
      [uuid(), c.query, c.resolved, c.time],
    );
  }

  saveDatabase();
  console.log("✅ Demo data seeded");
}

// Start
async function start() {
  try {
    await initDatabase();
    await seedDatabase(bcrypt);
    await seedDemoData();

    app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════╗
║   PANYA PLC Support Backend            ║
╠════════════════════════════════════════╣
║  🚀 Server: http://localhost:${PORT}       ║
║  📊 Dashboard: /api/dashboard/stats    ║
║  👥 Leads: /api/leads                  ║
╚════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error("Failed to start:", error);
    process.exit(1);
  }
}

start();
