// ============================================
// UI MODULE
// ============================================
export const UI = {
  elements: {},
  scrollLockY: 0,
  isBodyScrollLocked: false,

  cacheElements() {
    this.elements = {
      navbar: document.getElementById("navbar"),
      mobileMenuBtn: document.getElementById("mobileMenuBtn"),
      mobileMenu: document.getElementById("mobileMenu"),
      langToggleBg: document.getElementById("langToggleBg"),
      langButtons: document.querySelectorAll(".c-lang-toggle__btn"),
      themeToggle: document.getElementById("themeToggle"),
      // Mobile toggles
      mobileThemeToggle: document.getElementById("mobileThemeToggle"),
      mobileThemeIcon: document.getElementById("mobileThemeIcon"),
      mobileLangToggleBg: document.getElementById("mobileLangToggleBg"),
      contactForm: document.getElementById("contactForm"),
      formSuccess: document.getElementById("formSuccess"),
      faqItems: document.querySelectorAll(".l-faq__item"),
    };
  },

  updateNavbar(isScrolled) {
    if (this.elements.navbar) {
      this.elements.navbar.classList.toggle("l-navbar--scrolled", isScrolled);
    }
  },

  updateMobileMenu(isOpen) {
    const { mobileMenuBtn, mobileMenu } = this.elements;
    if (!mobileMenuBtn || !mobileMenu) return;

    mobileMenuBtn.classList.toggle("l-navbar__menu-btn--active", isOpen);
    mobileMenu.classList.toggle("l-navbar__mobile-menu--active", isOpen);
    mobileMenuBtn.setAttribute("aria-expanded", isOpen);
    mobileMenu.setAttribute("aria-hidden", !isOpen);

    if (isOpen) {
      this.lockBodyScroll();
    } else {
      this.unlockBodyScroll();
    }
  },

  lockBodyScroll() {
    if (this.isBodyScrollLocked) return;

    this.scrollLockY = window.scrollY || window.pageYOffset || 0;
    document.documentElement.classList.add("is-mobile-menu-open");
    document.body.classList.add("is-mobile-menu-open");
    document.body.style.position = "fixed";
    document.body.style.top = `-${this.scrollLockY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";
    this.isBodyScrollLocked = true;
  },

  unlockBodyScroll() {
    if (!this.isBodyScrollLocked) return;

    document.documentElement.classList.remove("is-mobile-menu-open");
    document.body.classList.remove("is-mobile-menu-open");
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.left = "";
    document.body.style.right = "";
    document.body.style.width = "";
    document.body.style.overflow = "";
    window.scrollTo(0, this.scrollLockY);
    this.isBodyScrollLocked = false;
  },

  updateLangToggle(currentLang) {
    const { langToggleBg, langButtons, mobileLangToggleBg } = this.elements;
    if (!langButtons.length) return;

    langButtons.forEach((btn) => {
      const isActive = btn.getAttribute("data-lang") === currentLang;
      btn.classList.toggle("c-lang-toggle__btn--active", isActive);
      btn.setAttribute("aria-pressed", isActive);
    });

    // Move background pill (desktop and mobile)
    // When EN is selected, pill should be on the right (--right class)
    // When TH is selected, pill should be on the left (no --right class)
    const isEnglish = currentLang === "en";
    if (langToggleBg) {
      langToggleBg.classList.toggle("c-lang-toggle__bg--right", isEnglish);
    }
    if (mobileLangToggleBg) {
      mobileLangToggleBg.classList.toggle(
        "c-lang-toggle__bg--right",
        isEnglish,
      );
    }
  },

  toggleFaq(item) {
    const isActive = item.classList.contains("l-faq__item--active");
    const question = item.querySelector(".l-faq__question");

    // Close all
    this.elements.faqItems.forEach((faq) => {
      faq.classList.remove("l-faq__item--active");
      faq
        .querySelector(".l-faq__question")
        ?.setAttribute("aria-expanded", "false");
    });

    // Open clicked if wasn't active
    if (!isActive) {
      item.classList.add("l-faq__item--active");
      question?.setAttribute("aria-expanded", "true");
    }
  },

  showFormSuccess() {
    const { contactForm, formSuccess } = this.elements;
    if (contactForm && formSuccess) {
      contactForm.classList.add("l-contact__form--success");
      formSuccess.classList.add("l-contact__success--active");

      setTimeout(() => {
        contactForm.classList.remove("l-contact__form--success");
        formSuccess.classList.remove("l-contact__success--active");
        contactForm.reset();
      }, 5000);
    }
  },
};
