import { AppState } from "./AppState.js";
import { UI } from "./UI.js";

// ============================================
// SCROLL MODULE
// ============================================
export const ScrollHandler = {
  heroBackground: null,

  init() {
    this.heroBackground = document.querySelector(".l-hero__bg-image");
    window.addEventListener("scroll", this.handleScroll.bind(this), {
      passive: true,
    });
    this.handleScroll();
  },

  handleScroll() {
    const scrollY = window.scrollY;
    const scrolled = scrollY > 50;
    AppState.setScrolled(scrolled);

    // Parallax effect for hero background
    if (this.heroBackground && scrollY < window.innerHeight) {
      const parallaxSpeed = 0.4;
      this.heroBackground.style.transform = `translateY(${scrollY * parallaxSpeed}px)`;
    }
  },

  smoothScroll(e) {
    const href = e.currentTarget.getAttribute("href");
    if (!href?.startsWith("#")) return;

    e.preventDefault();

    const target = document.querySelector(href);
    if (!target) return;

    AppState.closeMobileMenu();

    const navHeight = UI.elements.navbar?.offsetHeight || 80;
    const targetPosition =
      target.getBoundingClientRect().top + window.scrollY - navHeight - 20;

    window.scrollTo({
      top: targetPosition,
      behavior: "smooth",
    });
  },
};

// ============================================
// ANIMATION MODULE
// ============================================
export const Animator = {
  init() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      this.makeVisibleImmediately();
      return;
    }

    this.observeElements();
  },

  makeVisibleImmediately() {
    document
      .querySelectorAll(
        ".c-glass-card, .l-timeline__item, .l-metric__card, .l-pricing__card, .l-faq__item, .l-hero__content, .l-hero__visual",
      )
      .forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
  },

  observeElements() {
    const elements = document.querySelectorAll(
      ".c-glass-card, .l-timeline__item, .l-metric__card, .l-pricing__card, .l-faq__item, .l-hero__content, .l-hero__visual",
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Add a small random delay for natural feel if multiple items appear at once
            // But NOT based on global index to avoid huge delays
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "50px" }, // Increased rootMargin to trigger slightly earlier
    );

    elements.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(20px)";
      // Fixed duration, no variable delay
      el.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out";
      observer.observe(el);
    });
  },
};
