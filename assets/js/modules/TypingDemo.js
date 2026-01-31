/**
 * PANYA - Interactive Typing Demo
 * Simulates realistic AI chat typing effect in hero section
 */

class TypingDemo {
  constructor() {
    this.isActive = false;
    this.typingSpeed = 30; // ms per character
    this.pauseAfterUser = 800; // ms pause before AI responds
    this.pauseAfterAI = 4000; // ms before loop restarts
    this.heroCard = null;
    this.init();
  }

  init() {
    // Wait for components to load
    document.addEventListener("componentsLoaded", () => this.setup());
    // Fallback
    if (document.readyState === "complete") {
      setTimeout(() => this.setup(), 500);
    }
  }

  setup() {
    this.heroCard = document.querySelector(".l-hero__card-body");
    if (!this.heroCard) return;

    // Only run on larger screens for performance
    if (window.innerWidth <= 768) return;

    // Wait for i18n to populate content
    setTimeout(() => this.startDemo(), 1500);
  }

  async startDemo() {
    if (this.isActive) return;

    const userChat = this.heroCard.querySelector(".l-hero__chat--user p");
    const aiChat = this.heroCard.querySelector(".l-hero__chat--ai p");
    const citation = this.heroCard.querySelector(".l-hero__citation");

    if (!userChat || !aiChat) return;

    // Get text - check stored original first, then current textContent
    let userText =
      userChat.getAttribute("data-original") || userChat.textContent;
    let aiText = aiChat.getAttribute("data-original") || aiChat.textContent;

    // Validate text exists (i18n might not have loaded yet)
    if (
      !userText ||
      !aiText ||
      userText.trim() === "" ||
      aiText.trim() === ""
    ) {
      console.log("TypingDemo: Waiting for i18n content...");
      setTimeout(() => this.startDemo(), 500);
      return;
    }

    this.isActive = true;

    // Save original
    userChat.setAttribute("data-original", userText);
    aiChat.setAttribute("data-original", aiText);

    // Run demo loop
    while (this.isActive) {
      // Clear content
      userChat.textContent = "";
      aiChat.textContent = "";
      if (citation) citation.style.opacity = "0";
      aiChat.parentElement.style.opacity = "0";

      // Type user message
      await this.typeText(userChat, userText);
      await this.sleep(this.pauseAfterUser);

      // Show AI chat container with typing indicator
      aiChat.parentElement.style.opacity = "1";
      aiChat.innerHTML =
        '<span class="typing-indicator"><span></span><span></span><span></span></span>';
      await this.sleep(800);

      // Type AI response
      aiChat.textContent = "";
      await this.typeText(aiChat, aiText);

      // Show citation with fade
      if (citation) {
        citation.style.transition = "opacity 0.3s ease";
        citation.style.opacity = "1";
      }

      // Wait before looping
      await this.sleep(this.pauseAfterAI);
    }
  }

  async typeText(element, text) {
    if (!text || typeof text !== "string") return;

    for (let i = 0; i < text.length; i++) {
      element.textContent += text[i];
      // Vary typing speed slightly for realism
      const speed = this.typingSpeed + Math.random() * 20 - 10;
      await this.sleep(speed);
    }
  }

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  stop() {
    this.isActive = false;
  }
}

// Add typing indicator CSS dynamically
const style = document.createElement("style");
style.textContent = `
  .typing-indicator {
    display: inline-flex;
    gap: 4px;
    padding: 8px 0;
  }
  .typing-indicator span {
    width: 8px;
    height: 8px;
    background: var(--blue-400);
    border-radius: 50%;
    animation: typingBounce 1.4s ease-in-out infinite;
  }
  .typing-indicator span:nth-child(1) { animation-delay: 0s; }
  .typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
  .typing-indicator span:nth-child(3) { animation-delay: 0.4s; }
  @keyframes typingBounce {
    0%, 60%, 100% { transform: translateY(0); }
    30% { transform: translateY(-8px); }
  }
  .l-hero__chat--ai {
    transition: opacity 0.3s ease;
  }
`;
document.head.appendChild(style);

// Initialize
window.typingDemo = new TypingDemo();
