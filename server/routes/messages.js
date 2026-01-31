/**
 * Messages Routes - Customer Chat API
 */

import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import { query, queryOne, run } from "../config/database.js";

const router = Router();

// Get all messages
router.get("/", (req, res) => {
  try {
    const { limit = 20 } = req.query;
    const messages = query(
      `
      SELECT * FROM messages 
      ORDER BY created_at DESC 
      LIMIT ?
    `,
      [parseInt(limit)],
    );

    res.json({ messages });
  } catch (error) {
    console.error("Get messages error:", error);
    res.status(500).json({ error: "Failed to get messages" });
  }
});

// Create message (from customer)
router.post("/", (req, res) => {
  try {
    const { customer_name, customer_phone, message } = req.body;

    if (!customer_name || !message) {
      return res.status(400).json({ error: "Name and message required" });
    }

    const id = uuidv4();
    run(
      `
      INSERT INTO messages (id, customer_name, customer_phone, message)
      VALUES (?, ?, ?, ?)
    `,
      [id, customer_name, customer_phone, message],
    );

    res.status(201).json({ id });
  } catch (error) {
    res.status(500).json({ error: "Failed to create message" });
  }
});

// Reply to message
router.post("/:id/reply", (req, res) => {
  try {
    const { reply } = req.body;

    if (!reply) {
      return res.status(400).json({ error: "Reply required" });
    }

    run("UPDATE messages SET reply = ?, replied_at = ? WHERE id = ?", [
      reply,
      new Date().toISOString(),
      req.params.id,
    ]);

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to reply" });
  }
});

// Mark as read
router.put("/:id/read", (req, res) => {
  try {
    run("UPDATE messages SET is_read = 1 WHERE id = ?", [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to mark as read" });
  }
});

export default router;
