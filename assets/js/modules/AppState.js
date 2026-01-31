import { dictionary as i18n } from "./Dictionary.js";
import { UI } from "./UI.js";
import { I18n } from "./I18n.js";

// ============================================
// STATE MANAGEMENT
// ============================================
export const AppState = {
  currentLang: "en",
  currentTheme: "light",
  isMobileMenuOpen: false,
  isScrolled: false,

  init() {
    // Load saved preferences
    const savedLang = localStorage.getItem("panya-language");
    const savedTheme = localStorage.getItem("panya-theme");

    if (savedLang && i18n[savedLang]) {
      this.currentLang = savedLang;
    }
    if (savedTheme && ["light", "dark"].includes(savedTheme)) {
      this.currentTheme = savedTheme;
    }

    // Apply initial states
    this.applyTheme();
    return this;
  },

  setLanguage(lang) {
    if (lang === this.currentLang || !i18n[lang]) return;
    this.currentLang = lang;
    localStorage.setItem("panya-language", lang);
    this.applyLanguage();
  },

  toggleTheme() {
    this.currentTheme = this.currentTheme === "light" ? "dark" : "light";
    localStorage.setItem("panya-theme", this.currentTheme);
    this.applyTheme();
  },

  applyTheme() {
    document.documentElement.setAttribute("data-theme", this.currentTheme);

    // Update theme toggle icons (desktop and mobile)
    const themeIcon = document.getElementById("themeIcon");
    const mobileThemeIcon = document.getElementById("mobileThemeIcon");
    const iconClass =
      this.currentTheme === "light" ? "fas fa-moon" : "fas fa-sun";

    if (themeIcon) {
      themeIcon.className = iconClass;
    }
    if (mobileThemeIcon) {
      mobileThemeIcon.className = iconClass;
    }
  },

  applyLanguage() {
    document.documentElement.setAttribute("lang", this.currentLang);
    I18n.updateAll(this.currentLang);
    UI.updateLangToggle(this.currentLang);
  },

  setScrolled(scrolled) {
    this.isScrolled = scrolled;
    UI.updateNavbar(this.isScrolled);
  },

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    UI.updateMobileMenu(this.isMobileMenuOpen);
  },

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
    UI.updateMobileMenu(false);
  },
};
