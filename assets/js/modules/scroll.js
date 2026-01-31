/**
 * PANYA - Scroll Effects Module
 * Handles navbar scroll behavior and smooth scrolling
 */

export class ScrollManager {
  constructor() {
    this.navbar = document.getElementById("navbar");
    this.scrollThreshold = 50;
    this.lastScrollY = 0;

    this.init();
  }

  init() {
    if (!this.navbar) return;

    // Throttled scroll handler
    let ticking = false;
    window.addEventListener("scroll", () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          this.handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    });

    // Smooth scroll for anchor links
    this.setupSmoothScroll();
  }

  handleScroll() {
    const scrollY = window.scrollY;

    // Add/remove scrolled class
    if (scrollY > this.scrollThreshold) {
      this.navbar.classList.add("l-navbar--scrolled");
    } else {
      this.navbar.classList.remove("l-navbar--scrolled");
    }

    this.lastScrollY = scrollY;
  }

  setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        const targetId = anchor.getAttribute("href");
        if (targetId === "#") return;

        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();

          // Close mobile menu if open
          const mobileMenu = document.getElementById("mobileMenu");
          if (mobileMenu?.classList.contains("l-navbar__mobile-menu--active")) {
            mobileMenu.classList.remove("l-navbar__mobile-menu--active");
          }

          // Scroll to target with offset for navbar
          const navbarHeight = this.navbar?.offsetHeight || 80;
          const targetPosition =
            target.getBoundingClientRect().top +
            window.scrollY -
            navbarHeight -
            20;

          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          });
        }
      });
    });
  }
}

// Auto-initialize if not using ES modules
if (typeof module === "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    window.scrollManager = new ScrollManager();
  });
}
