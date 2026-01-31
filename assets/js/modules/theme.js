/**
 * PANYA - Theme Toggle Module
 * Handles dark/light theme switching with localStorage persistence
 */

export class ThemeManager {
  constructor() {
    this.themeToggle = document.getElementById("themeToggle");
    this.themeIcon = document.getElementById("themeIcon");
    this.prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

    this.init();
  }

  init() {
    // Load saved theme or use system preference
    const savedTheme = localStorage.getItem("panya-theme");
    if (savedTheme) {
      this.setTheme(savedTheme);
    } else if (this.prefersDark.matches) {
      this.setTheme("dark");
    }

    // Listen for toggle clicks
    if (this.themeToggle) {
      this.themeToggle.addEventListener("click", () => this.toggle());
    }

    // Listen for system preference changes
    this.prefersDark.addEventListener("change", (e) => {
      if (!localStorage.getItem("panya-theme")) {
        this.setTheme(e.matches ? "dark" : "light");
      }
    });
  }

  setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    this.updateIcon(theme);

    // Notify particle canvas about theme change
    if (window.particleCanvas) {
      window.particleCanvas.draw();
    }
  }

  updateIcon(theme) {
    if (this.themeIcon) {
      this.themeIcon.className =
        theme === "dark" ? "fas fa-sun" : "fas fa-moon";
    }
  }

  toggle() {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    this.setTheme(newTheme);
    localStorage.setItem("panya-theme", newTheme);
  }

  getTheme() {
    return document.documentElement.getAttribute("data-theme") || "light";
  }
}

// Auto-initialize if not using ES modules
if (typeof module === "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    window.themeManager = new ThemeManager();
  });
}
