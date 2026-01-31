/**
 * Audit Log Routes
 * View and filter audit logs
 */

import { Router } from "express";
import { query, queryOne } from "../config/database.js";
import { authenticate, requireRole } from "../middleware/auth.js";

const router = Router();

// All routes require admin role
router.use(authenticate);
router.use(requireRole("admin"));

/**
 * GET /api/audit
 * List audit logs with filtering
 */
router.get("/", (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      action,
      user_id,
      start_date,
      end_date,
      search,
    } = req.query;

    const offset = (page - 1) * limit;

    let sql = `
      SELECT a.*, u.name as user_name, u.email as user_email
      FROM audit_logs a
      LEFT JOIN users u ON a.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (action) {
      sql += " AND a.action = ?";
      params.push(action);
    }

    if (user_id) {
      sql += " AND a.user_id = ?";
      params.push(user_id);
    }

    if (start_date) {
      sql += " AND a.created_at >= ?";
      params.push(start_date);
    }

    if (end_date) {
      sql += " AND a.created_at <= ?";
      params.push(end_date);
    }

    if (search) {
      sql += " AND (a.action LIKE ? OR a.resource LIKE ? OR u.name LIKE ?)";
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    sql += " ORDER BY a.created_at DESC LIMIT ? OFFSET ?";
    params.push(parseInt(limit), parseInt(offset));

    const logs = query(sql, params);

    // Parse JSON details
    logs.forEach((log) => {
      if (log.details) {
        try {
          log.details = JSON.parse(log.details);
        } catch (e) {}
      }
    });

    // Get total count
    const countResult = queryOne(
      "SELECT COUNT(*) as total FROM audit_logs",
      [],
    );
    const total = countResult?.total || 0;

    res.json({
      logs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("List audit logs error:", error);
    res.status(500).json({ error: "Failed to list audit logs" });
  }
});

/**
 * GET /api/audit/security
 * Get security-related events
 */
router.get("/security", (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;

    const logs = query(
      `
      SELECT a.*, u.name as user_name, u.email as user_email
      FROM audit_logs a
      LEFT JOIN users u ON a.user_id = u.id
      WHERE a.action IN ('login_failed', 'logout', 'user_deleted', 'role_changed')
      ORDER BY a.created_at DESC
      LIMIT ? OFFSET ?
    `,
      [parseInt(limit), parseInt(offset)],
    );

    logs.forEach((log) => {
      if (log.details) {
        try {
          log.details = JSON.parse(log.details);
        } catch (e) {}
      }
    });

    res.json({ logs });
  } catch (error) {
    console.error("Security logs error:", error);
    res.status(500).json({ error: "Failed to get security logs" });
  }
});

/**
 * GET /api/audit/stats
 * Get audit statistics
 */
router.get("/stats", (req, res) => {
  try {
    const actionStats = query(
      `
      SELECT action, COUNT(*) as count
      FROM audit_logs
      WHERE created_at >= datetime('now', '-30 days')
      GROUP BY action
      ORDER BY count DESC
      LIMIT 10
    `,
      [],
    );

    const dailyStats = query(
      `
      SELECT date(created_at) as date, COUNT(*) as count
      FROM audit_logs
      WHERE created_at >= datetime('now', '-7 days')
      GROUP BY date(created_at)
      ORDER BY date DESC
    `,
      [],
    );

    const userStats = query(
      `
      SELECT u.name, u.email, COUNT(*) as action_count
      FROM audit_logs a
      JOIN users u ON a.user_id = u.id
      WHERE a.created_at >= datetime('now', '-30 days')
      GROUP BY a.user_id
      ORDER BY action_count DESC
      LIMIT 5
    `,
      [],
    );

    const failedLogins = queryOne(
      `
      SELECT COUNT(*) as count
      FROM audit_logs
      WHERE action = 'login_failed'
      AND created_at >= datetime('now', '-24 hours')
    `,
      [],
    );

    res.json({
      actionStats,
      dailyStats,
      userStats,
      failedLogins24h: failedLogins?.count || 0,
    });
  } catch (error) {
    console.error("Audit stats error:", error);
    res.status(500).json({ error: "Failed to get audit stats" });
  }
});

export default router;
