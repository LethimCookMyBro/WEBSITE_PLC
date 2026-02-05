/**
 * Rate Limiting Middleware
 * Centralized, environment-driven abuse protection.
 */

import rateLimit from "express-rate-limit";

function toInt(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function buildLimiter({
  windowMs,
  max,
  message,
  skipSuccessfulRequests = false,
  skip = undefined,
}) {
  return rateLimit({
    windowMs,
    max,
    skipSuccessfulRequests,
    skip,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({
        error: message,
        requestId: req.requestId,
      });
    },
    keyGenerator: (req) => `${req.ip}:${req.path}`,
  });
}

// General API limiter
export const apiLimiter = buildLimiter({
  windowMs: toInt(process.env.RATE_LIMIT_API_WINDOW_MS, 60 * 1000),
  max: toInt(process.env.RATE_LIMIT_API_MAX, 120),
  message: "Too many requests, please try again later",
  skip: (req) => req.path === "/health",
});

// Auth endpoints limiter
export const authLimiter = buildLimiter({
  windowMs: toInt(process.env.RATE_LIMIT_AUTH_WINDOW_MS, 15 * 60 * 1000),
  max: toInt(process.env.RATE_LIMIT_AUTH_MAX, 15),
  message: "Too many login attempts, please try again later",
  skipSuccessfulRequests: true,
});

// Contact form submit limiter
export const leadSubmitLimiter = buildLimiter({
  windowMs: toInt(process.env.RATE_LIMIT_LEADS_WINDOW_MS, 10 * 60 * 1000),
  max: toInt(process.env.RATE_LIMIT_LEADS_MAX, 20),
  message: "Lead submission limit reached, please try again later",
});

// Dashboard/API stats limiter
export const statsLimiter = buildLimiter({
  windowMs: toInt(process.env.RATE_LIMIT_STATS_WINDOW_MS, 5 * 60 * 1000),
  max: toInt(process.env.RATE_LIMIT_STATS_MAX, 180),
  message: "Too many dashboard requests, please slow down",
});

// Upload endpoints limiter
export const uploadLimiter = buildLimiter({
  windowMs: toInt(process.env.RATE_LIMIT_UPLOAD_WINDOW_MS, 60 * 60 * 1000),
  max: toInt(process.env.RATE_LIMIT_UPLOAD_MAX, 20),
  message: "Upload limit reached, please try again later",
});

export default {
  apiLimiter,
  authLimiter,
  leadSubmitLimiter,
  statsLimiter,
  uploadLimiter,
};
