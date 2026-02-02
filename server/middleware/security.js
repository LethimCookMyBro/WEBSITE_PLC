/**
 * Security Middleware
 * Input sanitization, validation, and security utilities
 */

/**
 * Sanitize string input - removes HTML tags and dangerous characters
 */
export function sanitizeString(str) {
    if (typeof str !== 'string') return str;

    return str
        // Remove HTML tags
        .replace(/<[^>]*>/g, '')
        // Remove script-like patterns
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '')
        // Trim and normalize whitespace
        .trim()
        .replace(/\s+/g, ' ');
}

/**
 * Sanitize an object's string properties
 */
export function sanitizeObject(obj) {
    if (!obj || typeof obj !== 'object') return obj;

    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'string') {
            sanitized[key] = sanitizeString(value);
        } else if (typeof value === 'object' && value !== null) {
            sanitized[key] = sanitizeObject(value);
        } else {
            sanitized[key] = value;
        }
    }
    return sanitized;
}

/**
 * Validate email format
 */
export function isValidEmail(email) {
    if (typeof email !== 'string') return false;

    // RFC 5322 simplified regex
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    return emailRegex.test(email) && email.length <= 254;
}

/**
 * Validate phone number format (Thai format)
 */
export function isValidPhone(phone) {
    if (typeof phone !== 'string') return false;

    // Thai phone: 0x-xxx-xxxx or 0xx-xxx-xxxx or 10 digits
    const phoneRegex = /^(\+66|66|0)?[689]\d{7,8}$/;
    const cleaned = phone.replace(/[-\s]/g, '');

    return phoneRegex.test(cleaned);
}

/**
 * Middleware to sanitize request body
 */
export function sanitizeBody(req, res, next) {
    if (req.body && typeof req.body === 'object') {
        req.body = sanitizeObject(req.body);
    }
    next();
}

/**
 * Security headers middleware
 * Adds additional headers not covered by Helmet
 */
export function securityHeaders(req, res, next) {
    // Prevent browsers from detecting MIME types
    res.setHeader('X-Content-Type-Options', 'nosniff');

    // Prevent clickjacking
    res.setHeader('X-Frame-Options', 'DENY');

    // XSS Protection
    res.setHeader('X-XSS-Protection', '1; mode=block');

    // Referrer Policy
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

    // Permissions Policy (disable unnecessary features)
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

    next();
}

/**
 * Validate required fields
 */
export function validateRequired(obj, requiredFields) {
    const missing = [];
    for (const field of requiredFields) {
        if (!obj[field] || (typeof obj[field] === 'string' && obj[field].trim() === '')) {
            missing.push(field);
        }
    }
    return missing;
}

export default {
    sanitizeString,
    sanitizeObject,
    sanitizeBody,
    isValidEmail,
    isValidPhone,
    securityHeaders,
    validateRequired,
};
