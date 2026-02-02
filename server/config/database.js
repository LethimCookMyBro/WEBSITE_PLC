/**
 * Database Configuration
 * SQLite using sql.js with proper WASM loading
 */

import initSqlJs from "sql.js";
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
let SQL = null;

/**
 * Initialize database connection
 */
export async function initDatabase() {
  try {
    // Initialize SQL.js - it will use built-in WASM
    SQL = await initSqlJs();

    // Load existing database or create new one
    if (fs.existsSync(DB_PATH)) {
      const fileBuffer = fs.readFileSync(DB_PATH);
      db = new SQL.Database(fileBuffer);
      console.log("✅ Loaded existing database from:", DB_PATH);
    } else {
      db = new SQL.Database();
      console.log("✅ Created new database");
    }

    // Load and execute schema
    const schemaPath = path.join(__dirname, "..", "models", "schema.sql");
    const schema = fs.readFileSync(schemaPath, "utf-8");
    db.run(schema);

    // Enable foreign keys
    db.run("PRAGMA foreign_keys = ON");

    // Save database periodically
    setInterval(saveDatabase, 30000); // Every 30 seconds

    console.log("✅ Database initialized at:", DB_PATH);

    return db;
  } catch (error) {
    console.error("Database initialization error:", error);
    throw error;
  }
}

/**
 * Save database to file
 */
export function saveDatabase() {
  if (db) {
    try {
      const data = db.export();
      const buffer = Buffer.from(data);
      fs.writeFileSync(DB_PATH, buffer);
    } catch (error) {
      console.error("Failed to save database:", error);
    }
  }
}

/**
 * Create default admin user if not exists
 */
export async function seedDatabase(bcrypt) {
  if (!db) return;

  const result = db.exec(
    "SELECT id FROM users WHERE email = 'admin@panya.com'",
  );

  if (result.length === 0 || result[0].values.length === 0) {
    const { v4: uuidv4 } = await import("uuid");
    const passwordHash = await bcrypt.hash("demo123", 10);

    // Create admin user
    db.run(
      `INSERT INTO users (id, email, password_hash, name, role, avatar)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [uuidv4(), "admin@panya.com", passwordHash, "เจ้าของร้าน", "admin", "A"],
    );

    saveDatabase();
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
    stmt.bind(params);

    const results = [];
    while (stmt.step()) {
      const row = stmt.getAsObject();
      results.push(row);
    }
    stmt.free();

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
  const results = query(sql, params);
  return results.length > 0 ? results[0] : null;
}

/**
 * Helper: Execute query (INSERT/UPDATE/DELETE)
 */
export function run(sql, params = []) {
  if (!db) throw new Error("Database not initialized");

  try {
    db.run(sql, params);
    saveDatabase();
    return { changes: db.getRowsModified() };
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
