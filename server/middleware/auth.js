/**
 * Authentication Middleware
 * JWT verification, session validation, and authorization guards.
 */

import { createHash } from "crypto";
import jwt from "jsonwebtoken";
import { queryOne } from "../config/database.js";

const DEFAULT_DEV_SECRET = "panya-dev-secret-change-in-production";
const rawJwtSecret = process.env.JWT_SECRET;
const JWT_SECRET = rawJwtSecret || DEFAULT_DEV_SECRET;
export const JWT_ISSUER = process.env.JWT_ISSUER || "panya-api";
export const JWT_AUDIENCE = process.env.JWT_AUDIENCE || "panya-admin";
const isProduction = process.env.NODE_ENV === "production";
const hasStrongJwtSecret =
  typeof rawJwtSecret === "string" && rawJwtSecret.length >= 32;

if (isProduction && !hasStrongJwtSecret) {
  console.error(
    "[SECURITY] JWT_SECRET is missing or weak (<32 chars). Auth routes will be unavailable until it is configured.",
  );
}

export function hashToken(token) {
  return createHash("sha256").update(token).digest("hex");
}

function verifyJwtToken(token) {
  return jwt.verify(token, JWT_SECRET, {
    algorithms: ["HS256"],
    issuer: JWT_ISSUER,
    audience: JWT_AUDIENCE,
  });
}

function getActiveSession(userId, tokenHash) {
  return queryOne(
    `
      SELECT id, expires_at
      FROM sessions
      WHERE user_id = ?
        AND token_hash = ?
        AND strftime('%s', expires_at) > strftime('%s', 'now')
      ORDER BY created_at DESC
      LIMIT 1
    `,
    [userId, tokenHash],
  );
}

/**
 * Verify JWT token and attach user to request.
 */
export function authenticate(req, res, next) {
  if (isProduction && !hasStrongJwtSecret) {
    return res.status(503).json({
      error: "Authentication is temporarily unavailable",
    });
  }

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyJwtToken(token);

    const session = getActiveSession(decoded.userId, hashToken(token));
    if (!session) {
      return res.status(401).json({ error: "Session expired or invalid" });
    }

    const user = queryOne(
      `
      SELECT id, email, name, role, tenant_id, avatar, is_active
      FROM users WHERE id = ?
    `,
      [decoded.userId],
    );

    if (!user || !user.is_active) {
      return res.status(401).json({ error: "User not found or inactive" });
    }

    req.user = user;
    req.token = token;
    req.session = session;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired" });
    }
    return res.status(401).json({ error: "Invalid token" });
  }
}

/**
 * Require specific roles.
 */
export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }

    next();
  };
}

/**
 * Optional authentication (doesn't fail when no/invalid token).
 */
export function optionalAuth(req, res, next) {
  if (isProduction && !hasStrongJwtSecret) {
    return next();
  }

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next();
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyJwtToken(token);
    const session = getActiveSession(decoded.userId, hashToken(token));
    if (!session) return next();

    const user = queryOne(
      `
        SELECT id, email, name, role, tenant_id, avatar
        FROM users
        WHERE id = ? AND is_active = 1
      `,
      [decoded.userId],
    );

    if (user) {
      req.user = user;
      req.token = token;
      req.session = session;
    }
  } catch (_) {
    // Ignore token errors in optional auth mode.
  }

  return next();
}

export { JWT_SECRET };
export function isJwtSecretReady() {
  return !isProduction || hasStrongJwtSecret;
}
