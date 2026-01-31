/**
 * User Management Routes
 * CRUD operations for users (Admin only)
 */

import { Router } from "express";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { query, queryOne, run } from "../config/database.js";
import { authenticate, requireRole } from "../middleware/auth.js";
import { logAudit } from "../middleware/audit.js";

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * GET /api/users
 * List all users (Admin only)
 */
router.get("/", requireRole("admin"), (req, res) => {
  try {
    const { page = 1, limit = 20, role, search } = req.query;
    const offset = (page - 1) * limit;

    let sql = `
      SELECT u.id, u.email, u.name, u.role, u.avatar, u.is_active, u.created_at,
             t.name as tenant_name
      FROM users u
      LEFT JOIN tenants t ON u.tenant_id = t.id
      WHERE 1=1
    `;
    const params = [];

    if (role) {
      sql += " AND u.role = ?";
      params.push(role);
    }

    if (search) {
      sql += " AND (u.name LIKE ? OR u.email LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }

    sql += " ORDER BY u.created_at DESC LIMIT ? OFFSET ?";
    params.push(parseInt(limit), parseInt(offset));

    const users = query(sql, params);

    // Get total count
    let countSql = "SELECT COUNT(*) as total FROM users WHERE 1=1";
    const countParams = [];

    if (role) {
      countSql += " AND role = ?";
      countParams.push(role);
    }

    if (search) {
      countSql += " AND (name LIKE ? OR email LIKE ?)";
      countParams.push(`%${search}%`, `%${search}%`);
    }

    const countResult = queryOne(countSql, countParams);
    const total = countResult?.total || 0;

    res.json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("List users error:", error);
    res.status(500).json({ error: "Failed to list users" });
  }
});

/**
 * GET /api/users/:id
 * Get single user
 */
router.get("/:id", requireRole("admin"), (req, res) => {
  try {
    const user = queryOne(
      `
      SELECT u.id, u.email, u.name, u.role, u.avatar, u.is_active, u.created_at, u.updated_at,
             t.name as tenant_name, t.id as tenant_id
      FROM users u
      LEFT JOIN tenants t ON u.tenant_id = t.id
      WHERE u.id = ?
    `,
      [req.params.id],
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ error: "Failed to get user" });
  }
});

/**
 * POST /api/users
 * Create new user (Admin only)
 */
router.post("/", requireRole("admin"), async (req, res) => {
  try {
    const { email, password, name, role = "viewer", tenant_id } = req.body;

    if (!email || !password || !name) {
      return res
        .status(400)
        .json({ error: "Email, password, and name are required" });
    }

    // Check if email exists
    const existing = queryOne("SELECT id FROM users WHERE email = ?", [
      email.toLowerCase(),
    ]);
    if (existing) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const id = uuidv4();
    const passwordHash = await bcrypt.hash(password, 10);
    const avatar = name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);

    run(
      `
      INSERT INTO users (id, email, password_hash, name, role, tenant_id, avatar)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
      [id, email.toLowerCase(), passwordHash, name, role, tenant_id, avatar],
    );

    logAudit(req.user.id, "user_created", "users", { userId: id, email }, req);

    res.status(201).json({ id, email, name, role, avatar });
  } catch (error) {
    console.error("Create user error:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

/**
 * PUT /api/users/:id
 * Update user (Admin only)
 */
router.put("/:id", requireRole("admin"), async (req, res) => {
  try {
    const { name, role, is_active, password } = req.body;
    const userId = req.params.id;

    // Check if user exists
    const existing = queryOne("SELECT id FROM users WHERE id = ?", [userId]);
    if (!existing) {
      return res.status(404).json({ error: "User not found" });
    }

    // Build update
    const updates = [];
    const params = [];

    if (name !== undefined) {
      updates.push("name = ?");
      params.push(name);
    }

    if (role !== undefined) {
      updates.push("role = ?");
      params.push(role);
    }

    if (is_active !== undefined) {
      updates.push("is_active = ?");
      params.push(is_active ? 1 : 0);
    }

    if (password) {
      const passwordHash = await bcrypt.hash(password, 10);
      updates.push("password_hash = ?");
      params.push(passwordHash);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }

    updates.push("updated_at = ?");
    params.push(new Date().toISOString());
    params.push(userId);

    run(`UPDATE users SET ${updates.join(", ")} WHERE id = ?`, params);

    logAudit(
      req.user.id,
      "user_updated",
      "users",
      { userId, updates: Object.keys(req.body) },
      req,
    );

    res.json({ success: true });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
});

/**
 * DELETE /api/users/:id
 * Delete user (Admin only)
 */
router.delete("/:id", requireRole("admin"), (req, res) => {
  try {
    const userId = req.params.id;

    // Prevent self-deletion
    if (userId === req.user.id) {
      return res.status(400).json({ error: "Cannot delete yourself" });
    }

    const result = run("DELETE FROM users WHERE id = ?", [userId]);

    if (result.changes === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    logAudit(req.user.id, "user_deleted", "users", { userId }, req);

    res.json({ success: true });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

export default router;
