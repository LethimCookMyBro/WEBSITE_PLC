/**
 * Audit Logging Middleware
 * Records all user actions
 */

import { v4 as uuidv4 } from "uuid";
import { run } from "../config/database.js";

/**
 * Log an audit event
 */
export function logAudit(
  userId,
  action,
  resource = null,
  details = null,
  req = null,
) {
  try {
    const normalizedDetails =
      details && typeof details === "object"
        ? { ...details, requestId: req?.requestId }
        : details
          ? { detail: details, requestId: req?.requestId }
          : req?.requestId
            ? { requestId: req.requestId }
            : null;

    run(
      `
      INSERT INTO audit_logs (id, user_id, action, resource, details, ip_address, user_agent)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
      [
        uuidv4(),
        userId,
        action,
        resource,
        normalizedDetails ? JSON.stringify(normalizedDetails) : null,
        req ? getClientIP(req) : null,
        req ? String(req.headers["user-agent"] || "").slice(0, 500) : null,
      ],
    );
  } catch (error) {
    console.error("Failed to log audit event:", error);
  }
}

/**
 * Get client IP address
 */
function getClientIP(req) {
  return (
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.headers["x-real-ip"] ||
    req.socket?.remoteAddress ||
    "unknown"
  );
}

/**
 * Middleware to auto-log requests
 */
export function auditMiddleware(action, resource) {
  return (req, res, next) => {
    // Log after response is sent
    res.on("finish", () => {
      if (res.statusCode < 400 && req.user) {
        logAudit(
          req.user.id,
          action,
          resource,
          {
            method: req.method,
            path: req.path,
            params: req.params,
            statusCode: res.statusCode,
          },
          req,
        );
      }
    });

    next();
  };
}

export default { logAudit, auditMiddleware };
