/**
 * Leads Routes - Contact Form Submissions
 */

import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import { query, queryOne, run } from "../config/database.js";
import { authenticate } from "../middleware/auth.js";
import {
  isValidEmail,
  isValidPhone,
  sanitizeString,
  validateRequired,
} from "../middleware/security.js";
import { leadSubmitLimiter } from "../middleware/rateLimit.js";

const router = Router();
const ALLOWED_STATUS = new Set([
  "new",
  "contacted",
  "qualified",
  "converted",
  "lost",
]);
const DEFAULT_LEAD_QUERY_LIMIT = 20;
const MAX_LEAD_QUERY_LIMIT = 100;

function normalizeLimit(rawLimit) {
  const parsed = Number.parseInt(rawLimit, 10);
  if (!Number.isFinite(parsed)) return DEFAULT_LEAD_QUERY_LIMIT;
  return Math.min(Math.max(parsed, 1), MAX_LEAD_QUERY_LIMIT);
}

// Get all leads
router.get("/", authenticate, (req, res) => {
  try {
    const limit = normalizeLimit(req.query.limit);
    const leads = query(
      `
      SELECT * FROM leads 
      ORDER BY created_at DESC 
      LIMIT ?
    `,
      [limit],
    );

    res.json({ leads });
  } catch (error) {
    console.error("Get leads error:", error);
    res.status(500).json({ error: "Failed to get leads" });
  }
});

// Get single lead
router.get("/:id", authenticate, (req, res) => {
  try {
    const lead = queryOne("SELECT * FROM leads WHERE id = ?", [req.params.id]);
    if (!lead) {
      return res.status(404).json({ error: "Lead not found" });
    }
    res.json(lead);
  } catch (error) {
    res.status(500).json({ error: "Failed to get lead" });
  }
});

// Create lead (from contact form) - with validation
router.post("/", leadSubmitLimiter, (req, res) => {
  try {
    const { name, position, company, email, phone, message } = req.body;

    // Validate required fields
    const missing = validateRequired(req.body, ["name", "email"]);
    if (missing.length > 0) {
      return res.status(400).json({
        error: `Missing required fields: ${missing.join(", ")}`,
      });
    }

    // Validate email format
    const normalizedEmail = sanitizeString(email, 254).toLowerCase();
    if (!isValidEmail(normalizedEmail)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Validate phone if provided
    if (phone && phone.trim() && !isValidPhone(phone)) {
      return res.status(400).json({ error: "Invalid phone format" });
    }

    // Additional sanitization (defense in depth)
    const sanitizedData = {
      name: sanitizeString(name, 100),
      position: sanitizeString(position || "", 100),
      company: sanitizeString(company || "", 200),
      email: normalizedEmail,
      phone: sanitizeString(phone || "", 20),
      message: sanitizeString(message || "", 2000),
    };

    const id = uuidv4();
    run(
      `
      INSERT INTO leads (id, name, position, company, email, phone, message)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
      [
        id,
        sanitizedData.name,
        sanitizedData.position,
        sanitizedData.company,
        sanitizedData.email,
        sanitizedData.phone,
        sanitizedData.message,
      ],
    );

    res.status(201).json({ id, success: true, message: "Lead created" });
  } catch (error) {
    console.error("Create lead error:", error);
    res.status(500).json({ error: "Failed to create lead" });
  }
});

// Update lead status
router.put("/:id", authenticate, (req, res) => {
  try {
    const { status, notes } = req.body;
    const normalizedStatus = status ? sanitizeString(status, 20) : null;

    if (normalizedStatus && !ALLOWED_STATUS.has(normalizedStatus)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const sanitizedNotes = sanitizeString(notes || "", 2000);

    run(
      "UPDATE leads SET status = COALESCE(?, status), notes = ?, updated_at = ? WHERE id = ?",
      [normalizedStatus, sanitizedNotes, new Date().toISOString(), req.params.id],
    );

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to update lead" });
  }
});

// Delete lead
router.delete("/:id", authenticate, (req, res) => {
  try {
    run("DELETE FROM leads WHERE id = ?", [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete lead" });
  }
});

export default router;
