/**
 * PANYA - Interactive Typing Demo
 * Stable typing loop with cancellation support and Thai-safe grapheme typing.
 */

class TypingDemo {
  constructor() {
    this.isActive = false;
    this.runId = 0;
    this.typingSpeed = 30;
    this.pauseAfterUser = 800;
    this.pauseAfterAI = 4000;
    this.heroCard = null;
    this.timers = new Set();
    this.segmenter =
      typeof Intl !== "undefined" && typeof Intl.Segmenter === "function"
        ? new Intl.Segmenter(undefined, { granularity: "grapheme" })
        : null;

    this.init();
  }

  init() {
    document.addEventListener("componentsLoaded", () => this.setup());
    document.addEventListener("languageChanged", () => this.handleLanguageChange());
    window.addEventListener("resize", () => this.handleViewportChange(), {
      passive: true,
    });

    if (document.readyState === "complete") {
      this.schedule(() => this.setup(), 500);
    }
  }

  schedule(callback, delayMs) {
    const timerId = window.setTimeout(() => {
      this.timers.delete(timerId);
      callback();
    }, delayMs);

    this.timers.add(timerId);
    return timerId;
  }

  clearTimers() {
    this.timers.forEach((timerId) => window.clearTimeout(timerId));
    this.timers.clear();
  }

  isDesktopViewport() {
    return window.innerWidth > 768;
  }

  getChatElements() {
    if (!this.heroCard) return null;

    const userChat = this.heroCard.querySelector(".l-hero__chat--user p");
    const aiChat = this.heroCard.querySelector(".l-hero__chat--ai p");
    const citation = this.heroCard.querySelector(".l-hero__citation");
    const aiBubble = aiChat?.parentElement || null;

    if (!userChat || !aiChat || !aiBubble) return null;
    return { userChat, aiChat, citation, aiBubble };
  }

  setup() {
    this.heroCard = document.querySelector(".l-hero__card-body");
    if (!this.heroCard) return;

    if (!this.isDesktopViewport()) {
      this.stop();
      this.restoreOriginalContent();
      return;
    }

    this.schedule(() => this.startDemo(), 1200);
  }

  handleLanguageChange() {
    this.stop();

    const elements = this.getChatElements();
    if (elements) {
      elements.userChat.removeAttribute("data-original");
      elements.aiChat.removeAttribute("data-original");
    }

    this.schedule(() => this.startDemo(), 140);
  }

  handleViewportChange() {
    if (!this.heroCard) {
      this.setup();
      return;
    }

    if (!this.isDesktopViewport()) {
      this.stop();
      this.restoreOriginalContent();
      return;
    }

    if (!this.isActive) {
      this.schedule(() => this.startDemo(), 300);
    }
  }

  splitGraphemes(text) {
    if (!text || typeof text !== "string") return [];
    if (!this.segmenter) return Array.from(text);

    return Array.from(this.segmenter.segment(text), (part) => part.segment);
  }

  restoreOriginalContent() {
    const elements = this.getChatElements();
    if (!elements) return;

    const userOriginal =
      elements.userChat.getAttribute("data-original") || elements.userChat.textContent || "";
    const aiOriginal =
      elements.aiChat.getAttribute("data-original") || elements.aiChat.textContent || "";

    elements.userChat.textContent = userOriginal;
    elements.aiChat.textContent = aiOriginal;
    elements.aiBubble.style.opacity = "1";
    if (elements.citation) {
      elements.citation.style.opacity = "1";
    }
  }

  async startDemo() {
    if (!this.heroCard || !this.isDesktopViewport()) return;

    this.stop();
    this.isActive = true;
    const currentRun = this.runId;

    const elements = this.getChatElements();
    if (!elements) return;

    const userText =
      elements.userChat.getAttribute("data-original") || elements.userChat.textContent || "";
    const aiText =
      elements.aiChat.getAttribute("data-original") || elements.aiChat.textContent || "";

    if (!userText.trim() || !aiText.trim()) {
      this.schedule(() => this.startDemo(), 300);
      return;
    }

    elements.userChat.setAttribute("data-original", userText);
    elements.aiChat.setAttribute("data-original", aiText);

    while (this.isCurrentRun(currentRun)) {
      elements.userChat.textContent = "";
      elements.aiChat.textContent = "";
      elements.aiBubble.style.opacity = "0";
      if (elements.citation) {
        elements.citation.style.opacity = "0";
      }

      await this.typeText(elements.userChat, userText, currentRun);
      if (!this.isCurrentRun(currentRun)) return;

      await this.sleep(this.pauseAfterUser, currentRun);
      if (!this.isCurrentRun(currentRun)) return;

      elements.aiBubble.style.opacity = "1";
      elements.aiChat.innerHTML =
        '<span class="typing-indicator"><span></span><span></span><span></span></span>';

      await this.sleep(800, currentRun);
      if (!this.isCurrentRun(currentRun)) return;

      elements.aiChat.textContent = "";
      await this.typeText(elements.aiChat, aiText, currentRun);
      if (!this.isCurrentRun(currentRun)) return;

      if (elements.citation) {
        elements.citation.style.transition = "opacity 0.28s ease";
        elements.citation.style.opacity = "1";
      }

      await this.sleep(this.pauseAfterAI, currentRun);
    }
  }

  async typeText(element, text, runId) {
    const graphemes = this.splitGraphemes(text);

    for (let i = 0; i < graphemes.length; i += 1) {
      if (!this.isCurrentRun(runId)) return;
      element.textContent += graphemes[i];
      const speed = this.typingSpeed + Math.random() * 16 - 8;
      await this.sleep(speed, runId);
    }
  }

  sleep(ms, runId) {
    return new Promise((resolve) => {
      const timerId = window.setTimeout(() => {
        this.timers.delete(timerId);
        if (!this.isCurrentRun(runId)) {
          resolve();
          return;
        }
        resolve();
      }, Math.max(0, Math.floor(ms)));
      this.timers.add(timerId);
    });
  }

  isCurrentRun(runId) {
    return this.isActive && this.runId === runId;
  }

  stop() {
    this.isActive = false;
    this.runId += 1;
    this.clearTimers();
  }
}

function ensureTypingIndicatorStyles() {
  if (document.getElementById("typing-demo-styles")) return;

  const style = document.createElement("style");
  style.id = "typing-demo-styles";
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
}

ensureTypingIndicatorStyles();
window.typingDemo = new TypingDemo();
