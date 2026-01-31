/**
 * Leads Routes - Contact Form Submissions
 */

import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import { query, queryOne, run } from "../config/database.js";

const router = Router();

// Get all leads
router.get("/", (req, res) => {
  try {
    const { limit = 20 } = req.query;
    const leads = query(
      `
      SELECT * FROM leads 
      ORDER BY created_at DESC 
      LIMIT ?
    `,
      [parseInt(limit)],
    );

    res.json({ leads });
  } catch (error) {
    console.error("Get leads error:", error);
    res.status(500).json({ error: "Failed to get leads" });
  }
});

// Get single lead
router.get("/:id", (req, res) => {
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

// Create lead (from contact form)
router.post("/", (req, res) => {
  try {
    const { name, position, company, email, phone, message } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: "Name and email required" });
    }

    const id = uuidv4();
    run(
      `
      INSERT INTO leads (id, name, position, company, email, phone, message)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
      [id, name, position, company, email, phone, message],
    );

    res.status(201).json({ id, success: true, message: "Lead created" });
  } catch (error) {
    console.error("Create lead error:", error);
    res.status(500).json({ error: "Failed to create lead" });
  }
});

// Update lead status
router.put("/:id", (req, res) => {
  try {
    const { status, notes } = req.body;

    run("UPDATE leads SET status = ?, notes = ?, updated_at = ? WHERE id = ?", [
      status,
      notes,
      new Date().toISOString(),
      req.params.id,
    ]);

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to update lead" });
  }
});

// Delete lead
router.delete("/:id", (req, res) => {
  try {
    run("DELETE FROM leads WHERE id = ?", [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete lead" });
  }
});

export default router;
