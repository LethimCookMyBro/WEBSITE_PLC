/**
 * PANYA - Intelligent RAG-Based Technical Support Assistant
 * Main JavaScript Application v2.0 (Modular Refactor)
 */

import { dictionary } from "./js/modules/Dictionary.js";
import { AppState } from "./js/modules/AppState.js";
import { I18n } from "./js/modules/I18n.js";
import { UI } from "./js/modules/UI.js";
import { FormValidator } from "./js/modules/FormValidator.js";
import { ScrollHandler, Animator } from "./js/modules/Animators.js";

// ============================================
// EVENT BINDING
// ============================================
function bindEvents() {
  // Language toggle (both desktop and mobile)
  UI.elements.langButtons?.forEach((btn) => {
    btn.addEventListener("click", () => {
      const lang = btn.getAttribute("data-lang");
      AppState.setLanguage(lang);
    });
  });

  // Theme toggle (desktop)
  UI.elements.themeToggle?.addEventListener("click", () => {
    AppState.toggleTheme();
  });

  // Theme toggle (mobile)
  UI.elements.mobileThemeToggle?.addEventListener("click", () => {
    AppState.toggleTheme();
  });

  // Mobile menu toggle
  UI.elements.mobileMenuBtn?.addEventListener("click", () => {
    AppState.toggleMobileMenu();
  });

  // Mobile menu Close Button
  const mobileCloseBtn = document.getElementById("mobileMenuCloseBtn");
  mobileCloseBtn?.addEventListener("click", () => {
    AppState.closeMobileMenu();
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", ScrollHandler.smoothScroll);
  });

  // FAQ accordion
  UI.elements.faqItems?.forEach((item) => {
    const question = item.querySelector(".l-faq__question");
    question?.addEventListener("click", () => UI.toggleFaq(item));
  });

  // Contact form
  UI.elements.contactForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    if (FormValidator.validateForm(e.target)) {
      UI.showFormSuccess();
    }
  });

  // Real-time validation
  UI.elements.contactForm
    ?.querySelectorAll("input, textarea")
    .forEach((field) => {
      field.addEventListener("blur", () => FormValidator.validateField(field));
      field.addEventListener("input", () => {
        const group = field.closest(".l-contact__group");
        if (group?.classList.contains("l-contact__group--error")) {
          FormValidator.validateField(field);
        }
      });
    });

  // Keyboard shortcuts
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && AppState.isMobileMenuOpen) {
      AppState.closeMobileMenu();
    }
  });

  // Close mobile menu on outside click
  document.addEventListener("click", (e) => {
    if (
      AppState.isMobileMenuOpen &&
      !UI.elements.mobileMenu?.contains(e.target) &&
      !UI.elements.mobileMenuBtn?.contains(e.target)
    ) {
      AppState.closeMobileMenu();
    }
  });
}

// ============================================
// INITIALIZATION
// ============================================
function init() {
  // Cache DOM elements
  UI.cacheElements();

  // Initialize state
  AppState.init();

  // Apply initial language
  I18n.updateAll(AppState.currentLang);
  UI.updateLangToggle(AppState.currentLang);

  // Initialize modules
  ScrollHandler.init();
  Animator.init();

  // Bind events
  bindEvents();

  console.log("✅ PANYA initialized (Modular)", {
    language: AppState.currentLang,
    theme: AppState.currentTheme,
  });
}

// Start when components are loaded (via component-loader.js)
// Falls back to DOMContentLoaded for non-component pages
if (window.ComponentsLoaded) {
  init();
} else {
  document.addEventListener("componentsLoaded", init);
}

// Fallback: if no components system, init on DOMContentLoaded
if (!document.querySelector('[id$="-container"]')) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
}

// ============================================
// DEBUG / GLOBAL ACCESS
// ============================================
window.Panya = {
  AppState,
  UI,
  I18n,
  dictionary,
};
