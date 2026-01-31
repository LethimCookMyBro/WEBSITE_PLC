// ============================================
// FORM VALIDATION MODULE
// ============================================
export const FormValidator = {
  // Security: Maximum input lengths to prevent DoS
  MAX_LENGTHS: {
    name: 100,
    job_title: 100,
    email: 254, // RFC 5321 limit
    phone: 20,
    company: 200,
    message: 5000,
  },

  // Security: Sanitize input to prevent XSS
  sanitizeInput(input) {
    if (typeof input !== "string") return "";
    return input
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;")
      .trim();
  },

  // Security: Improved email validation regex (more strict)
  validateEmail(email) {
    // RFC 5322 compliant email regex (simplified)
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email) && email.length <= this.MAX_LENGTHS.email;
  },

  // Phone validation (Global standard with + and numbers)
  validatePhone(phone) {
    // Allow +, -, space, brackets, and digits. Min 9 digits.
    const phoneRegex =
      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    // Simple check: at least 9 digits, allowed chars only
    const digitsOnly = phone.replace(/\D/g, "");
    const allowedChars = /^[0-9+\-\s()]+$/;

    return (
      allowedChars.test(phone) &&
      digitsOnly.length >= 9 &&
      phone.length <= this.MAX_LENGTHS.phone
    );
  },

  // Security: Validate input length
  validateLength(value, fieldName) {
    const maxLength = this.MAX_LENGTHS[fieldName] || 1000;
    return value.length <= maxLength;
  },

  validateField(field) {
    const group = field.closest(".l-contact__group");
    if (!group) return true;

    const value = this.sanitizeInput(field.value);
    const fieldName = field.name || field.id;
    let isValid = true;
    let errorMessage = "";

    group.classList.remove("l-contact__group--error");

    // Required check
    if (field.hasAttribute("required") && !value) {
      isValid = false;
    }

    // Email validation
    if (field.type === "email" && value && !this.validateEmail(value)) {
      isValid = false;
    }

    // Phone validation
    if (
      (field.type === "tel" || fieldName === "phone") &&
      value &&
      !this.validatePhone(value)
    ) {
      isValid = false;
    }

    // Length validation
    if (value && !this.validateLength(value, fieldName)) {
      isValid = false;
    }

    if (!isValid) {
      group.classList.add("l-contact__group--error");
    }

    return isValid;
  },

  validateForm(form) {
    const requiredFields = form.querySelectorAll(
      "input[required], textarea[required]",
    );
    let isValid = true;

    requiredFields.forEach((field) => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });

    return isValid;
  },
};
