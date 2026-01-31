/**
 * PANYA - Animated Tech Background
 * Particle animation for hero section
 */

class ParticleCanvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext("2d");
    this.particles = [];
    this.connections = [];
    this.mouse = { x: null, y: null, radius: 150 };
    this.animationId = null;
    this.isRunning = false;

    // Configuration
    this.config = {
      particleCount: 60,
      particleSize: { min: 1, max: 3 },
      particleSpeed: 0.3,
      connectionDistance: 120,
      colors: {
        light: {
          particle: "rgba(59, 130, 246, 0.6)",
          connection: "rgba(59, 130, 246, 0.15)",
          glow: "rgba(59, 130, 246, 0.3)",
        },
        dark: {
          particle: "rgba(96, 165, 250, 0.8)",
          connection: "rgba(96, 165, 250, 0.2)",
          glow: "rgba(96, 165, 250, 0.4)",
        },
      },
    };

    this.init();
  }

  init() {
    this.resize();
    this.createParticles();
    this.bindEvents();
    this.start();
  }

  resize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
  }

  createParticles() {
    this.particles = [];
    const { particleCount, particleSize, particleSpeed } = this.config;

    for (let i = 0; i < particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size:
          Math.random() * (particleSize.max - particleSize.min) +
          particleSize.min,
        speedX: (Math.random() - 0.5) * particleSpeed,
        speedY: (Math.random() - 0.5) * particleSpeed,
        pulse: Math.random() * Math.PI * 2,
      });
    }
  }

  bindEvents() {
    window.addEventListener("resize", () => {
      this.resize();
      this.createParticles();
    });

    this.canvas.addEventListener("mousemove", (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
    });

    this.canvas.addEventListener("mouseleave", () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });
  }

  getColors() {
    const isDark =
      document.documentElement.getAttribute("data-theme") === "dark";
    return isDark ? this.config.colors.dark : this.config.colors.light;
  }

  update() {
    this.particles.forEach((p) => {
      // Update position
      p.x += p.speedX;
      p.y += p.speedY;

      // Update pulse for glow effect
      p.pulse += 0.02;

      // Bounce off edges
      if (p.x < 0 || p.x > this.canvas.width) p.speedX *= -1;
      if (p.y < 0 || p.y > this.canvas.height) p.speedY *= -1;

      // Mouse interaction - particles move away from cursor
      if (this.mouse.x !== null && this.mouse.y !== null) {
        const dx = this.mouse.x - p.x;
        const dy = this.mouse.y - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.mouse.radius) {
          const force = (this.mouse.radius - distance) / this.mouse.radius;
          p.x -= dx * force * 0.02;
          p.y -= dy * force * 0.02;
        }
      }
    });
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const colors = this.getColors();

    // Draw connections
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.config.connectionDistance) {
          const opacity = 1 - distance / this.config.connectionDistance;
          this.ctx.strokeStyle = colors.connection.replace(
            /[\d.]+\)$/,
            `${opacity * 0.3})`,
          );
          this.ctx.lineWidth = 1;
          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.stroke();
        }
      }
    }

    // Draw particles
    this.particles.forEach((p) => {
      const glowSize = p.size + Math.sin(p.pulse) * 1;

      // Outer glow
      const gradient = this.ctx.createRadialGradient(
        p.x,
        p.y,
        0,
        p.x,
        p.y,
        glowSize * 4,
      );
      gradient.addColorStop(0, colors.glow);
      gradient.addColorStop(1, "transparent");
      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, glowSize * 4, 0, Math.PI * 2);
      this.ctx.fill();

      // Core particle
      this.ctx.fillStyle = colors.particle;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, glowSize, 0, Math.PI * 2);
      this.ctx.fill();
    });
  }

  animate() {
    if (!this.isRunning) return;

    this.update();
    this.draw();
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.animate();
  }

  stop() {
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }
}

// Initialize when DOM is ready
// Initialize when components are loaded
document.addEventListener("componentsLoaded", () => {
  window.particleCanvas = new ParticleCanvas("particleCanvas");
});

// Fallback: check on DOMContentLoaded (if canvas is already present)
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("particleCanvas") && !window.particleCanvas) {
    window.particleCanvas = new ParticleCanvas("particleCanvas");
  }
});
