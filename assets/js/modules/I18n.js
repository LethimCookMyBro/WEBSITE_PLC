import { dictionary as i18n } from "./Dictionary.js";

// ============================================
// I18N MODULE
// ============================================
export const I18n = {
  updateAll(lang) {
    const translations = i18n[lang];
    const elements = document.querySelectorAll("[data-i18n]");

    elements.forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (translations[key]) {
        this.setElementText(el, translations[key]);
      }
    });
  },

  setElementText(el, text) {
    // Handle elements with child icons
    const hasIcon = el.querySelector("i, svg");
    const textSpan = el.querySelector("span:not([data-i18n])");

    if (hasIcon && textSpan) {
      // Update text span content
      textSpan.textContent = text;
    } else if (el.children.length === 0) {
      // No children, set text directly
      el.textContent = text;
    } else {
      // Find and update text node
      const textNode = Array.from(el.childNodes).find(
        (node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim(),
      );
      if (textNode) {
        textNode.textContent = text;
      } else if (textSpan) {
        textSpan.textContent = text;
      }
    }
  },

  getText(key) {
    return i18n[AppState.currentLang]?.[key] || key;
  },
};
