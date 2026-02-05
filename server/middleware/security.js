/**
 * Security Middleware
 * Request hardening, input sanitization, and defense-in-depth utilities.
 */

import { randomUUID } from "crypto";

const MAX_SANITIZE_DEPTH = 6;
const MAX_SANITIZE_ARRAY_LENGTH = 100;
const DEFAULT_MAX_STRING_LENGTH = 4000;
const PROTOTYPE_POLLUTION_KEYS = new Set(["__proto__", "prototype", "constructor"]);

/**
 * Remove unsafe characters/patterns from untrusted text input.
 */
export function sanitizeString(value, maxLength = DEFAULT_MAX_STRING_LENGTH) {
  if (typeof value !== "string") return "";

  return value
    .replace(/<[^>]*>/g, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "")
    .replace(/[\u0000-\u001f\u007f]/g, "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, maxLength);
}

function isUnsafeObjectKey(key) {
  return PROTOTYPE_POLLUTION_KEYS.has(key);
}

function sanitizeAny(value, depth = 0) {
  if (depth > MAX_SANITIZE_DEPTH) return undefined;

  if (typeof value === "string") {
    return sanitizeString(value);
  }

  if (Array.isArray(value)) {
    return value
      .slice(0, MAX_SANITIZE_ARRAY_LENGTH)
      .map((item) => sanitizeAny(item, depth + 1))
      .filter((item) => item !== undefined);
  }

  if (value && typeof value === "object") {
    const sanitized = {};

    for (const [key, nestedValue] of Object.entries(value)) {
      if (isUnsafeObjectKey(key)) continue;
      const normalized = sanitizeAny(nestedValue, depth + 1);
      if (normalized !== undefined) {
        sanitized[key] = normalized;
      }
    }

    return sanitized;
  }

  return value;
}

/**
 * Sanitize an object's string properties recursively.
 */
export function sanitizeObject(obj) {
  if (!obj || typeof obj !== "object") return obj;
  return sanitizeAny(obj, 0);
}

function hasUnsafeKeys(value, depth = 0) {
  if (!value || typeof value !== "object" || depth > MAX_SANITIZE_DEPTH) {
    return false;
  }

  if (Array.isArray(value)) {
    return value.some((item) => hasUnsafeKeys(item, depth + 1));
  }

  for (const [key, nestedValue] of Object.entries(value)) {
    if (isUnsafeObjectKey(key)) return true;
    if (hasUnsafeKeys(nestedValue, depth + 1)) return true;
  }

  return false;
}

function isLikelyHttps(req) {
  return req.secure || req.headers["x-forwarded-proto"] === "https";
}

/**
 * Attach request metadata for traceability.
 */
export function attachRequestMetadata(req, res, next) {
  const incoming = req.headers["x-request-id"];
  const validIncoming =
    typeof incoming === "string" &&
    /^[A-Za-z0-9._:-]{8,120}$/.test(incoming);

  req.requestId = validIncoming ? incoming : randomUUID();
  res.setHeader("X-Request-Id", req.requestId);

  next();
}

/**
 * Block suspicious objects early (prototype pollution attempts).
 */
export function rejectSuspiciousPayload(req, res, next) {
  if (
    hasUnsafeKeys(req.body) ||
    hasUnsafeKeys(req.query) ||
    hasUnsafeKeys(req.params)
  ) {
    return res.status(400).json({
      error: "Suspicious payload blocked",
      requestId: req.requestId,
    });
  }

  next();
}

/**
 * Validate email format.
 */
export function isValidEmail(email) {
  if (typeof email !== "string") return false;

  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  return emailRegex.test(email) && email.length <= 254;
}

/**
 * Validate phone number format.
 */
export function isValidPhone(phone) {
  if (typeof phone !== "string") return false;

  const cleaned = phone.replace(/[-\s]/g, "");
  const phoneRegex = /^(\+66|66|0)?[689]\d{7,8}$/;
  return phoneRegex.test(cleaned);
}

/**
 * Middleware to sanitize request body.
 */
export function sanitizeBody(req, res, next) {
  if (req.body && typeof req.body === "object") {
    req.body = sanitizeObject(req.body);
  }
  next();
}

/**
 * Middleware to sanitize request query.
 */
export function sanitizeQuery(req, res, next) {
  if (req.query && typeof req.query === "object") {
    const sanitized = sanitizeObject(req.query);
    Object.keys(req.query).forEach((key) => delete req.query[key]);
    if (sanitized && typeof sanitized === "object") {
      Object.assign(req.query, sanitized);
    }
  }
  next();
}

/**
 * Additional security headers not covered or customized beyond Helmet defaults.
 */
export function securityHeaders(req, res, next) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  );
  res.setHeader("X-DNS-Prefetch-Control", "off");
  res.setHeader("X-Permitted-Cross-Domain-Policies", "none");
  res.setHeader("Cross-Origin-Resource-Policy", "same-origin");
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Origin-Agent-Cluster", "?1");

  if (process.env.NODE_ENV === "production" || isLikelyHttps(req)) {
    res.setHeader(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload",
    );
  }

  next();
}

/**
 * Disable caching on sensitive endpoints.
 */
export function noStore(req, res, next) {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
}

/**
 * Validate required fields.
 */
export function validateRequired(obj, requiredFields) {
  const missing = [];

  for (const field of requiredFields) {
    if (
      !obj[field] ||
      (typeof obj[field] === "string" && obj[field].trim() === "")
    ) {
      missing.push(field);
    }
  }

  return missing;
}

export default {
  attachRequestMetadata,
  rejectSuspiciousPayload,
  sanitizeString,
  sanitizeObject,
  sanitizeBody,
  sanitizeQuery,
  isValidEmail,
  isValidPhone,
  securityHeaders,
  noStore,
  validateRequired,
};
