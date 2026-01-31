/**
 * Orders Routes - E-commerce API
 */

import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import { query, queryOne, run } from "../config/database.js";

const router = Router();

// Get all orders
router.get("/", (req, res) => {
  try {
    const { limit = 20, status } = req.query;

    let sql = "SELECT * FROM orders";
    const params = [];

    if (status) {
      sql += " WHERE status = ?";
      params.push(status);
    }

    sql += " ORDER BY created_at DESC LIMIT ?";
    params.push(parseInt(limit));

    const orders = query(sql, params);

    res.json({ orders });
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({ error: "Failed to get orders" });
  }
});

// Get single order
router.get("/:id", (req, res) => {
  try {
    const order = queryOne("SELECT * FROM orders WHERE id = ?", [
      req.params.id,
    ]);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Failed to get order" });
  }
});

// Create order
router.post("/", (req, res) => {
  try {
    const { customer_name, customer_phone, items, total, address } = req.body;

    if (!customer_name || !items || !total) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const id = uuidv4();
    run(
      `
      INSERT INTO orders (id, customer_name, customer_phone, items, total, address, status)
      VALUES (?, ?, ?, ?, ?, ?, 'pending')
    `,
      [id, customer_name, customer_phone, items, total, address],
    );

    res.status(201).json({ id, status: "pending" });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
});

// Update order status
router.put("/:id/status", (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["pending", "shipping", "done", "cancelled"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    run("UPDATE orders SET status = ?, updated_at = ? WHERE id = ?", [
      status,
      new Date().toISOString(),
      req.params.id,
    ]);

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to update order" });
  }
});

export default router;
