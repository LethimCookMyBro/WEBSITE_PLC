/**
 * PANYA - FAQ Accordion Module
 * Handles FAQ section interactivity with smooth animations
 */

export class FAQManager {
  constructor() {
    this.faqItems = document.querySelectorAll(".l-faq__item");
    this.init();
  }

  init() {
    if (!this.faqItems.length) return;

    this.faqItems.forEach((item) => {
      const question = item.querySelector(".l-faq__question");

      if (question) {
        question.addEventListener("click", () => this.toggleItem(item));
      }
    });
  }

  toggleItem(targetItem) {
    const isActive = targetItem.classList.contains("l-faq__item--active");

    // Close all other items
    this.faqItems.forEach((item) => {
      if (item !== targetItem) {
        this.closeItem(item);
      }
    });

    // Toggle target item
    if (isActive) {
      this.closeItem(targetItem);
    } else {
      this.openItem(targetItem);
    }
  }

  openItem(item) {
    const question = item.querySelector(".l-faq__question");

    item.classList.add("l-faq__item--active");
    question?.setAttribute("aria-expanded", "true");
  }

  closeItem(item) {
    const question = item.querySelector(".l-faq__question");

    item.classList.remove("l-faq__item--active");
    question?.setAttribute("aria-expanded", "false");
  }

  closeAll() {
    this.faqItems.forEach((item) => this.closeItem(item));
  }
}

// Auto-initialize if not using ES modules
if (typeof module === "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    window.faqManager = new FAQManager();
  });
}
