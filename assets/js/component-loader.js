/**
 * Component Loader for PANYA Website
 * Loads HTML components dynamically using fetch API
 */

const ComponentLoader = {
  components: [
    ["navbar-container", "components/navbar.html"],
    ["hero-container", "components/hero.html"],
    ["problem-container", "components/problem.html"],
    ["product-container", "components/product.html"],
    ["how-it-works-container", "components/how-it-works.html"],
    ["prototype-container", "components/prototype.html"],
    ["results-container", "components/results.html"],
    ["pricing-container", "components/pricing.html"],
    ["faq-container", "components/faq.html"],
    ["contact-container", "components/contact.html"],
    ["footer-container", "components/footer.html"],
  ],

  async loadComponent(elementId, componentPath) {
    const element = document.getElementById(elementId);
    if (!element) {
      console.warn(`Container #${elementId} not found`);
      return;
    }

    try {
      const response = await fetch(componentPath);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const html = await response.text();
      element.innerHTML = html;
    } catch (error) {
      console.error(`Failed to load ${componentPath}:`, error);
      element.innerHTML = `<div style="padding: 2rem; text-align: center; color: #ef4444;">
        Failed to load component: ${componentPath}
      </div>`;
    }
  },

  async loadAll() {
    console.log("🔄 Loading components...");
    const startTime = performance.now();

    // Load all components in parallel
    await Promise.all(
      this.components.map(([id, path]) => this.loadComponent(id, path)),
    );

    const loadTime = (performance.now() - startTime).toFixed(2);
    console.log(`✅ All components loaded in ${loadTime}ms`);

    // Dispatch event when all components are loaded
    window.ComponentsLoaded = true;
    document.dispatchEvent(new CustomEvent("componentsLoaded"));
  },

  init() {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.loadAll());
    } else {
      this.loadAll();
    }
  },
};

// Start loading components
ComponentLoader.init();
