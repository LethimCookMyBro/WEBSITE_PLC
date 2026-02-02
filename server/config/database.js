/**
 * Database Configuration
 * SQLite using better-sqlite3 (Native Node.js)
 */

import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Database path - uses Railway Volume in production
const DB_PATH =
  process.env.DATABASE_PATH || path.join(__dirname, "..", "data", "panya.db");

// Ensure data directory exists
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

let db = null;

/**
 * Initialize database connection
 */
export async function initDatabase() {
  try {
    // Create or open database
    db = new Database(DB_PATH);

    // Enable WAL mode for better concurrency
    db.pragma("journal_mode = WAL");

    // Enable foreign keys
    db.pragma("foreign_keys = ON");

    console.log("✅ Database initialized at:", DB_PATH);

    // Load and execute schema
    const schemaPath = path.join(__dirname, "..", "models", "schema.sql");
    const schema = fs.readFileSync(schemaPath, "utf-8");

    // Execute schema (split by semicolons and run each statement)
    const statements = schema
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    for (const stmt of statements) {
      db.exec(stmt);
    }

    console.log("✅ Database schema loaded");

    return db;
  } catch (error) {
    console.error("Database initialization error:", error);
    throw error;
  }
}

/**
 * Save database to file (no-op for better-sqlite3 - auto-saves)
 */
export function saveDatabase() {
  // better-sqlite3 automatically saves to disk
  // This function is kept for API compatibility
  if (db) {
    db.pragma("wal_checkpoint(TRUNCATE)");
  }
}

/**
 * Create default admin user if not exists
 */
export async function seedDatabase(bcrypt) {
  if (!db) return;

  const stmt = db.prepare("SELECT id FROM users WHERE email = ?");
  const result = stmt.get("admin@panya.com");

  if (!result) {
    const { v4: uuidv4 } = await import("uuid");
    const passwordHash = await bcrypt.hash("demo123", 10);

    // Create admin user
    const insertStmt = db.prepare(`
      INSERT INTO users (id, email, password_hash, name, role, avatar)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    insertStmt.run(
      uuidv4(),
      "admin@panya.com",
      passwordHash,
      "เจ้าของร้าน",
      "admin",
      "A",
    );

    console.log("✅ Admin user created");
  }
}

/**
 * Get database instance
 */
export function getDb() {
  return db;
}

/**
 * Helper: Execute query and return results
 */
export function query(sql, params = []) {
  if (!db) throw new Error("Database not initialized");

  try {
    const stmt = db.prepare(sql);
    const results = stmt.all(...params);
    return results;
  } catch (error) {
    console.error("Query error:", error, sql);
    throw error;
  }
}

/**
 * Helper: Execute query and return first row
 */
export function queryOne(sql, params = []) {
  if (!db) throw new Error("Database not initialized");

  try {
    const stmt = db.prepare(sql);
    const result = stmt.get(...params);
    return result || null;
  } catch (error) {
    console.error("QueryOne error:", error, sql);
    throw error;
  }
}

/**
 * Helper: Execute query (INSERT/UPDATE/DELETE)
 */
export function run(sql, params = []) {
  if (!db) throw new Error("Database not initialized");

  try {
    const stmt = db.prepare(sql);
    const info = stmt.run(...params);
    return { changes: info.changes, lastInsertRowid: info.lastInsertRowid };
  } catch (error) {
    console.error("Run error:", error, sql);
    throw error;
  }
}

// Export helpers as default
export default {
  initDatabase,
  seedDatabase,
  saveDatabase,
  getDb,
  query,
  queryOne,
  run,
};
