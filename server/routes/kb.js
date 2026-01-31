/**
 * Knowledge Base Routes
 * CRUD operations for documents
 */

import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import { query, queryOne, run } from "../config/database.js";
import { authenticate, requireRole } from "../middleware/auth.js";
import { logAudit } from "../middleware/audit.js";

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * GET /api/kb
 * List knowledge base documents
 */
router.get("/", (req, res) => {
  try {
    const { page = 1, limit = 20, brand, status, category, search } = req.query;

    const offset = (page - 1) * limit;

    let sql = `
      SELECT kb.*, u.name as uploaded_by_name
      FROM knowledge_base kb
      LEFT JOIN users u ON kb.uploaded_by = u.id
      WHERE 1=1
    `;
    const params = [];

    if (brand) {
      sql += " AND kb.brand = ?";
      params.push(brand);
    }

    if (status) {
      sql += " AND kb.status = ?";
      params.push(status);
    }

    if (category) {
      sql += " AND kb.category = ?";
      params.push(category);
    }

    if (search) {
      sql += " AND (kb.title LIKE ? OR kb.brand LIKE ? OR kb.model LIKE ?)";
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    sql += " ORDER BY kb.created_at DESC LIMIT ? OFFSET ?";
    params.push(parseInt(limit), parseInt(offset));

    const documents = query(sql, params);

    const countResult = queryOne(
      "SELECT COUNT(*) as total FROM knowledge_base",
      [],
    );
    const total = countResult?.total || 0;

    res.json({
      documents,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("List KB error:", error);
    res.status(500).json({ error: "Failed to list documents" });
  }
});

/**
 * GET /api/kb/stats
 * Get KB statistics
 */
router.get("/stats", (req, res) => {
  try {
    const statusStats = query(
      `
      SELECT status, COUNT(*) as count
      FROM knowledge_base
      GROUP BY status
    `,
      [],
    );

    const brandStats = query(
      `
      SELECT brand, COUNT(*) as count
      FROM knowledge_base
      WHERE brand IS NOT NULL
      GROUP BY brand
      ORDER BY count DESC
      LIMIT 10
    `,
      [],
    );

    const recentUploads = query(
      `
      SELECT kb.id, kb.title, kb.brand, kb.model, kb.status, kb.created_at,
             u.name as uploaded_by_name
      FROM knowledge_base kb
      LEFT JOIN users u ON kb.uploaded_by = u.id
      ORDER BY kb.created_at DESC
      LIMIT 5
    `,
      [],
    );

    const totalResult = queryOne(
      "SELECT COUNT(*) as count FROM knowledge_base",
      [],
    );

    res.json({
      statusStats,
      brandStats,
      recentUploads,
      total: totalResult?.count || 0,
    });
  } catch (error) {
    console.error("KB stats error:", error);
    res.status(500).json({ error: "Failed to get KB stats" });
  }
});

/**
 * GET /api/kb/:id
 * Get single document
 */
router.get("/:id", (req, res) => {
  try {
    const doc = queryOne(
      `
      SELECT kb.*, u.name as uploaded_by_name, r.name as reviewed_by_name
      FROM knowledge_base kb
      LEFT JOIN users u ON kb.uploaded_by = u.id
      LEFT JOIN users r ON kb.reviewed_by = r.id
      WHERE kb.id = ?
    `,
      [req.params.id],
    );

    if (!doc) {
      return res.status(404).json({ error: "Document not found" });
    }

    res.json(doc);
  } catch (error) {
    console.error("Get KB error:", error);
    res.status(500).json({ error: "Failed to get document" });
  }
});

/**
 * POST /api/kb
 * Create new document
 */
router.post("/", requireRole("admin", "engineer"), (req, res) => {
  try {
    const { title, brand, model, category, content } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    const id = uuidv4();

    run(
      `
      INSERT INTO knowledge_base (id, title, brand, model, category, content, uploaded_by)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
      [id, title, brand, model, category, content, req.user.id],
    );

    logAudit(
      req.user.id,
      "kb_created",
      "knowledge_base",
      { docId: id, title },
      req,
    );

    res.status(201).json({ id, title, status: "draft" });
  } catch (error) {
    console.error("Create KB error:", error);
    res.status(500).json({ error: "Failed to create document" });
  }
});

/**
 * PUT /api/kb/:id
 * Update document
 */
router.put("/:id", requireRole("admin", "engineer"), (req, res) => {
  try {
    const { title, brand, model, category, content, status } = req.body;
    const docId = req.params.id;

    const existing = queryOne("SELECT id FROM knowledge_base WHERE id = ?", [
      docId,
    ]);
    if (!existing) {
      return res.status(404).json({ error: "Document not found" });
    }

    const updates = [];
    const params = [];

    if (title !== undefined) {
      updates.push("title = ?");
      params.push(title);
    }
    if (brand !== undefined) {
      updates.push("brand = ?");
      params.push(brand);
    }
    if (model !== undefined) {
      updates.push("model = ?");
      params.push(model);
    }
    if (category !== undefined) {
      updates.push("category = ?");
      params.push(category);
    }
    if (content !== undefined) {
      updates.push("content = ?");
      params.push(content);
    }

    if (status !== undefined) {
      updates.push("status = ?");
      params.push(status);
      if (status === "reviewed" || status === "verified") {
        updates.push("reviewed_by = ?");
        params.push(req.user.id);
      }
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }

    updates.push("updated_at = ?");
    params.push(new Date().toISOString());
    params.push(docId);

    run(`UPDATE knowledge_base SET ${updates.join(", ")} WHERE id = ?`, params);

    logAudit(req.user.id, "kb_updated", "knowledge_base", { docId }, req);

    res.json({ success: true });
  } catch (error) {
    console.error("Update KB error:", error);
    res.status(500).json({ error: "Failed to update document" });
  }
});

/**
 * DELETE /api/kb/:id
 * Delete document
 */
router.delete("/:id", requireRole("admin"), (req, res) => {
  try {
    const docId = req.params.id;
    const result = run("DELETE FROM knowledge_base WHERE id = ?", [docId]);

    if (result.changes === 0) {
      return res.status(404).json({ error: "Document not found" });
    }

    logAudit(req.user.id, "kb_deleted", "knowledge_base", { docId }, req);

    res.json({ success: true });
  } catch (error) {
    console.error("Delete KB error:", error);
    res.status(500).json({ error: "Failed to delete document" });
  }
});

export default router;
