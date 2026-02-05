import { AppState } from "./AppState.js";
import { UI } from "./UI.js";

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function rafThrottle(callback) {
  let frameId = null;
  let pendingArgs = null;

  return (...args) => {
    pendingArgs = args;
    if (frameId) return;

    frameId = window.requestAnimationFrame(() => {
      frameId = null;
      callback(...pendingArgs);
    });
  };
}

// ============================================
// SCROLL MODULE
// ============================================
export const ScrollHandler = {
  heroBackground: null,
  onScroll: null,
  heroParallaxSpeed: 0.22,
  heroParallaxMaxOffset: 120,
  navbarScrollThreshold: 36,

  init() {
    if (this.onScroll) return;

    this.heroBackground = document.querySelector(".l-hero__bg-image");
    this.onScroll = rafThrottle(() => this.handleScroll());

    window.addEventListener("scroll", this.onScroll, {
      passive: true,
    });
    window.addEventListener("resize", this.onScroll, {
      passive: true,
    });
    this.onScroll();
  },

  handleScroll() {
    const scrollY = window.scrollY || window.pageYOffset || 0;
    const scrolled = scrollY > this.navbarScrollThreshold;
    AppState.setScrolled(scrolled);

    if (!this.heroBackground || prefersReducedMotion()) {
      return;
    }

    const visibleRange = window.innerHeight * 0.9;
    if (scrollY <= visibleRange) {
      const offset = clamp(
        scrollY * this.heroParallaxSpeed,
        0,
        this.heroParallaxMaxOffset,
      );
      this.heroBackground.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`;
    }
  },

  smoothScroll(e) {
    const href = e.currentTarget.getAttribute("href");
    if (!href?.startsWith("#")) return;

    e.preventDefault();

    const target = document.querySelector(href);
    if (!target) return;

    AppState.closeMobileMenu();

    const navHeight =
      UI.elements?.navbar?.offsetHeight ||
      document.getElementById("navbar")?.offsetHeight ||
      80;
    const targetPosition =
      target.getBoundingClientRect().top + window.scrollY - navHeight - 20;

    window.scrollTo({
      top: targetPosition,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  },
};

// ============================================
// ANIMATION MODULE
// ============================================
export const Animator = {
  observer: null,
  revealItems: [],
  isInitialized: false,
  revealGroups: [
    { selector: ".l-hero__badges", effect: "up", baseDelay: 80 },
    { selector: ".l-hero__title", effect: "up", baseDelay: 120 },
    { selector: ".l-hero__subtitle", effect: "up", baseDelay: 170 },
    { selector: ".l-hero__ctas", effect: "up", baseDelay: 220 },
    { selector: ".l-hero__visual", effect: "zoom", baseDelay: 180 },
    { selector: ".c-section-header", effect: "up", stagger: 40 },
    { selector: ".l-problem__card", effect: "up", stagger: 90 },
    { selector: ".l-features__card", effect: "up", stagger: 70 },
    { selector: ".l-why", effect: "up", baseDelay: 60 },
    { selector: ".l-timeline__item", effect: "slide", stagger: 70 },
    { selector: ".l-mockup", effect: "zoom", stagger: 80 },
    { selector: ".l-proto__feature", effect: "up", stagger: 60 },
    { selector: ".l-pricing__card", effect: "up", stagger: 90 },
    { selector: ".l-faq__item", effect: "up", stagger: 60 },
    { selector: ".l-contact__form-wrapper", effect: "up", baseDelay: 30 },
    { selector: ".l-contact__card", effect: "up", stagger: 70 },
    { selector: ".l-footer__grid > *", effect: "up", stagger: 60 },
    { selector: ".l-footer__bottom", effect: "up", baseDelay: 80 },
  ],

  init() {
    if (this.isInitialized) return;
    this.isInitialized = true;

    this.bootstrapNavbarAnimation();
    this.collectRevealItems();

    if (prefersReducedMotion()) {
      this.makeVisibleImmediately();
      return;
    }

    this.observeElements();
    window.setTimeout(() => this.forceRevealFallback(), 2600);
  },

  bootstrapNavbarAnimation() {
    const navLinks = document.querySelectorAll(".l-navbar__links .l-navbar__link");
    const navActions = document.querySelectorAll(".l-navbar__actions > *");

    navLinks.forEach((link, index) => {
      link.style.setProperty("--nav-enter-delay", `${140 + index * 40}ms`);
    });

    navActions.forEach((action, index) => {
      action.style.setProperty("--nav-enter-delay", `${420 + index * 70}ms`);
    });

    window.requestAnimationFrame(() => {
      document.body.classList.add("is-app-ready");
    });
  },

  collectRevealItems() {
    this.revealItems = [];

    this.revealGroups.forEach((group) => {
      const nodes = document.querySelectorAll(group.selector);
      if (!nodes.length) return;

      nodes.forEach((node, index) => {
        if (node.dataset.revealBound === "true") return;

        const delayMs = (group.baseDelay || 0) + index * (group.stagger || 0);
        node.dataset.revealBound = "true";
        node.dataset.revealEffect = group.effect || "up";
        node.classList.add("js-reveal");
        node.style.setProperty("--reveal-delay", `${delayMs}ms`);
        this.revealItems.push(node);
      });
    });
  },

  makeVisibleImmediately() {
    document.body.classList.add("is-app-ready");
    this.revealItems.forEach((item) => item.classList.add("is-visible"));
  },

  observeElements() {
    if (!this.revealItems.length) {
      return;
    }

    this.observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.18,
        rootMargin: "0px 0px -10% 0px",
      },
    );

    this.revealItems.forEach((item) => this.observer.observe(item));
  },

  forceRevealFallback() {
    if (!this.revealItems.length) return;

    this.revealItems.forEach((item) => {
      if (!item.classList.contains("is-visible")) {
        item.classList.add("is-visible");
      }
    });
  },
};
