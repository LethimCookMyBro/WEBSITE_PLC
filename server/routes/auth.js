/**
 * Authentication Routes
 * Login, logout, and session management
 */

import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { query, queryOne, run } from "../config/database.js";
import { authenticate, JWT_SECRET } from "../middleware/auth.js";
import { logAudit } from "../middleware/audit.js";
import { authLimiter } from "../middleware/rateLimit.js";

const router = Router();

// Token expiry (7 days)
const TOKEN_EXPIRY = "7d";

/**
 * POST /api/auth/login
 * Authenticate user and return JWT
 */
router.post("/login", authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    // Find user
    const user = queryOne(
      `
      SELECT id, email, password_hash, name, role, tenant_id, avatar, is_active
      FROM users WHERE email = ?
    `,
      [email.toLowerCase()],
    );

    if (!user) {
      logAudit(
        null,
        "login_failed",
        "auth",
        { email, reason: "user_not_found" },
        req,
      );
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (!user.is_active) {
      logAudit(
        user.id,
        "login_failed",
        "auth",
        { reason: "user_inactive" },
        req,
      );
      return res.status(401).json({ error: "Account is disabled" });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      logAudit(
        user.id,
        "login_failed",
        "auth",
        { reason: "wrong_password" },
        req,
      );
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: TOKEN_EXPIRY,
    });

    // Store session
    const sessionId = uuidv4();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    run(
      `
      INSERT INTO sessions (id, user_id, token_hash, ip_address, user_agent, expires_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `,
      [
        sessionId,
        user.id,
        token.substring(token.length - 20),
        req.ip,
        req.headers["user-agent"],
        expiresAt.toISOString(),
      ],
    );

    // Log successful login
    logAudit(user.id, "login_success", "auth", null, req);

    // Return user data
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
        tenant_id: user.tenant_id,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

/**
 * POST /api/auth/logout
 * Invalidate current session
 */
router.post("/logout", authenticate, (req, res) => {
  try {
    // Delete session
    run("DELETE FROM sessions WHERE user_id = ?", [req.user.id]);

    // Log logout
    logAudit(req.user.id, "logout", "auth", null, req);

    res.json({ success: true });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ error: "Logout failed" });
  }
});

/**
 * GET /api/auth/me
 * Get current user info
 */
router.get("/me", authenticate, (req, res) => {
  res.json({
    id: req.user.id,
    email: req.user.email,
    name: req.user.name,
    role: req.user.role,
    avatar: req.user.avatar,
    tenant_id: req.user.tenant_id,
  });
});

/**
 * POST /api/auth/refresh
 * Refresh JWT token
 */
router.post("/refresh", authenticate, (req, res) => {
  try {
    const newToken = jwt.sign(
      { userId: req.user.id, role: req.user.role },
      JWT_SECRET,
      { expiresIn: TOKEN_EXPIRY },
    );

    res.json({ token: newToken });
  } catch (error) {
    console.error("Refresh error:", error);
    res.status(500).json({ error: "Token refresh failed" });
  }
});

export default router;
