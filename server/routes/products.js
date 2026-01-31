/**
 * Products Routes - E-commerce API
 */

import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import { query, queryOne, run } from "../config/database.js";

const router = Router();

// Get all products
router.get("/", (req, res) => {
  try {
    const { limit = 20 } = req.query;
    const products = query(
      `
      SELECT * FROM products 
      WHERE is_visible = 1 
      ORDER BY created_at DESC 
      LIMIT ?
    `,
      [parseInt(limit)],
    );

    res.json({ products });
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ error: "Failed to get products" });
  }
});

// Get single product
router.get("/:id", (req, res) => {
  try {
    const product = queryOne("SELECT * FROM products WHERE id = ?", [
      req.params.id,
    ]);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Failed to get product" });
  }
});

// Create product
router.post("/", (req, res) => {
  try {
    const { name, price, stock = 0, image = null } = req.body;

    if (!name || !price) {
      return res.status(400).json({ error: "Name and price are required" });
    }

    const id = uuidv4();
    run(
      `
      INSERT INTO products (id, name, price, stock, image)
      VALUES (?, ?, ?, ?, ?)
    `,
      [id, name, price, stock, image],
    );

    res.status(201).json({ id, name, price, stock });
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({ error: "Failed to create product" });
  }
});

// Update product
router.put("/:id", (req, res) => {
  try {
    const { name, price, stock } = req.body;
    const id = req.params.id;

    const updates = [];
    const params = [];

    if (name !== undefined) {
      updates.push("name = ?");
      params.push(name);
    }
    if (price !== undefined) {
      updates.push("price = ?");
      params.push(price);
    }
    if (stock !== undefined) {
      updates.push("stock = ?");
      params.push(stock);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }

    updates.push("updated_at = ?");
    params.push(new Date().toISOString());
    params.push(id);

    run(`UPDATE products SET ${updates.join(", ")} WHERE id = ?`, params);

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to update product" });
  }
});

// Toggle product visibility
router.put("/:id/toggle", (req, res) => {
  try {
    const product = queryOne("SELECT is_visible FROM products WHERE id = ?", [
      req.params.id,
    ]);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    run("UPDATE products SET is_visible = ? WHERE id = ?", [
      product.is_visible ? 0 : 1,
      req.params.id,
    ]);

    res.json({ success: true, is_visible: !product.is_visible });
  } catch (error) {
    res.status(500).json({ error: "Failed to toggle product" });
  }
});

// Delete product
router.delete("/:id", (req, res) => {
  try {
    run("DELETE FROM products WHERE id = ?", [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete product" });
  }
});

export default router;
