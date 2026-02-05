/**
 * Authentication Routes
 * Login, logout, and session management
 */

import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { queryOne, run } from "../config/database.js";
import {
  authenticate,
  hashToken,
  isJwtSecretReady,
  JWT_AUDIENCE,
  JWT_ISSUER,
  JWT_SECRET,
} from "../middleware/auth.js";
import { logAudit } from "../middleware/audit.js";
import { authLimiter } from "../middleware/rateLimit.js";
import { isValidEmail, sanitizeString } from "../middleware/security.js";

const router = Router();

// Token expiry (7 days)
const TOKEN_EXPIRY = "7d";
const PASSWORD_MIN_LENGTH = 6;

function createJwtToken(user) {
  return jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: TOKEN_EXPIRY,
    issuer: JWT_ISSUER,
    audience: JWT_AUDIENCE,
    algorithm: "HS256",
  });
}

/**
 * POST /api/auth/login
 * Authenticate user and return JWT
 */
router.post("/login", authLimiter, async (req, res) => {
  try {
    if (!isJwtSecretReady()) {
      return res
        .status(503)
        .json({ error: "Authentication service not configured" });
    }

    const email = sanitizeString(req.body?.email || "").toLowerCase();
    const password = typeof req.body?.password === "string" ? req.body.password : "";

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    if (password.length < PASSWORD_MIN_LENGTH) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Find user
    const user = queryOne(
      `
      SELECT id, email, password_hash, name, role, tenant_id, avatar, is_active
      FROM users WHERE email = ?
    `,
      [email],
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
    const token = createJwtToken(user);

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
        hashToken(token),
        req.ip,
        sanitizeString(req.headers["user-agent"] || "", 500),
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
    // Invalidate only current session token
    run("DELETE FROM sessions WHERE user_id = ? AND token_hash = ?", [
      req.user.id,
      hashToken(req.token),
    ]);

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
    if (!isJwtSecretReady()) {
      return res
        .status(503)
        .json({ error: "Authentication service not configured" });
    }

    const newToken = createJwtToken(req.user);
    const newExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    run(
      `
      UPDATE sessions
      SET token_hash = ?, expires_at = ?
      WHERE id = ?
    `,
      [hashToken(newToken), newExpiresAt.toISOString(), req.session.id],
    );

    logAudit(req.user.id, "token_refresh", "auth", null, req);

    res.json({ token: newToken });
  } catch (error) {
    console.error("Refresh error:", error);
    res.status(500).json({ error: "Token refresh failed" });
  }
});

export default router;
