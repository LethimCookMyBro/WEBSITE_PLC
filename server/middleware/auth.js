/**
 * Authentication Middleware
 * JWT verification and role checking
 */

import jwt from "jsonwebtoken";
import { queryOne } from "../config/database.js";

const JWT_SECRET =
  process.env.JWT_SECRET || "panya-dev-secret-change-in-production";

/**
 * Verify JWT token and attach user to request
 */
export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // Get user from database
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

    // Attach user to request
    req.user = user;
    req.token = token;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired" });
    }
    return res.status(401).json({ error: "Invalid token" });
  }
}

/**
 * Require specific roles
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
 * Optional authentication (don't fail if no token)
 */
export function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = queryOne(
        `
        SELECT id, email, name, role, tenant_id, avatar
        FROM users WHERE id = ? AND is_active = 1
      `,
        [decoded.userId],
      );

      if (user) {
        req.user = user;
        req.token = token;
      }
    } catch (error) {
      // Ignore invalid tokens for optional auth
    }
  }

  next();
}

export { JWT_SECRET };
