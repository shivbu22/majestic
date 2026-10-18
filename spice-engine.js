/* ============================================================
   MAJESTIC ESSENCE — Spice Kinetic Engine
   Multi-Preset Canvas Particle Physics & 3D Interactive Tilt
   Vanilla JS — Pure Standards, Zero Dependencies
   ============================================================ */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.SpiceEngine = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const prefersReducedMotion = typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ──────────────────────────────────────────────────────────
     1. MULTI-PRESET PARTICLE SYSTEM
     Presets: 'gold-dust', 'seed-drift', 'leaf-swirl'
     ────────────────────────────────────────────────────────── */
  class ParticleCanvas {
    constructor(canvas, options = {}) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.preset = options.preset || canvas.dataset.particlePreset || canvas.dataset.spiceCanvas || 'gold-dust';
      this.colorTheme = options.colorTheme || canvas.dataset.particleColor || 'default';
      this.density = options.density || (window.innerWidth < 768 ? 20 : 45);
      this.particles = [];
      this.animId = null;
      this.isActive = false;
      this.w = 0;
      this.h = 0;

      this.resize = this.resize.bind(this);
      this.animate = this.animate.bind(this);

      if (!prefersReducedMotion) {
        this.init();
      }
    }

    init() {
      this.resize();
      window.addEventListener('resize', this.resize, { passive: true });

      for (let i = 0; i < this.density; i++) {
        this.particles.push(this.createParticle());
      }

      // IntersectionObserver for performance culling
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.start();
          } else {
            this.stop();
          }
        });
      }, { threshold: 0.05 });

      this.observer.observe(this.canvas);
    }

    resize() {
      const rect = this.canvas.parentElement ? this.canvas.parentElement.getBoundingClientRect() : null;
      this.w = this.canvas.width = rect && rect.width ? rect.width : window.innerWidth;
      this.h = this.canvas.height = rect && rect.height ? rect.height : window.innerHeight;
    }

    createParticle() {
      const isMobile = window.innerWidth < 768;
      const base = {
        x: Math.random() * this.w,
        y: Math.random() * this.h,
        life: Math.random() * 200,
        maxLife: 400 + Math.random() * 500
      };

      if (this.preset === 'seed-drift') {
        // Kalonji / Ajwain seeds: dark angular shapes with rotation
        return {
          ...base,
          type: Math.random() > 0.5 ? 'kalonji' : 'ajwain',
          size: Math.random() * (isMobile ? 2.5 : 3.5) + 1.5,
          speedX: (Math.random() - 0.5) * 0.4,
          speedY: Math.random() * 0.3 + 0.15,
          angle: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.02,
          opacity: Math.random() * 0.45 + 0.25
        };
      } else if (this.preset === 'leaf-swirl') {
        // Moringa / Curry leaves: floating green botanical flakes
        return {
          ...base,
          size: Math.random() * (isMobile ? 3 : 5) + 2.5,
          speedX: (Math.random() - 0.5) * 0.35,
          speedY: Math.random() * 0.25 + 0.1,
          angle: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.03,
          swayFreq: Math.random() * 0.02 + 0.01,
          swayAmp: Math.random() * 1.5 + 0.5,
          opacity: Math.random() * 0.4 + 0.2,
          hue: 95 + Math.random() * 35 // Botanical emerald green
        };
      } else if (this.preset === 'saffron-embers') {
        // Floating glowing warm saffron embers drifting upward
        return {
          ...base,
          size: Math.random() * (isMobile ? 2.5 : 4) + 1,
          speedX: (Math.random() - 0.5) * 0.3,
          speedY: -(Math.random() * 0.3 + 0.15),
          opacity: Math.random() * 0.5 + 0.2,
          hue: 25 + Math.random() * 25 // Saffron to deep amber
        };
      } else if (this.preset === 'starlight-nebula') {
        // Twinkling cosmic stardust with plum/indigo tones
        return {
          ...base,
          size: Math.random() * 2.5 + 0.8,
          speedX: (Math.random() - 0.5) * 0.15,
          speedY: (Math.random() - 0.5) * 0.15,
          opacity: Math.random() * 0.5 + 0.2,
          hue: Math.random() > 0.4 ? 260 + Math.random() * 30 : 40 + Math.random() * 15 // Violet or Gold
        };
      } else if (this.preset === 'desert-sand') {
        // Fine Rajasthan desert sand drifting diagonally
        return {
          ...base,
          size: Math.random() * 2 + 0.8,
          speedX: Math.random() * 0.4 + 0.2,
          speedY: Math.random() * 0.2 + 0.1,
          opacity: Math.random() * 0.4 + 0.15,
          hue: 15 + Math.random() * 25 // Terracotta ochre
        };
      } else {
        // Default: 'gold-dust'
        let hue = 38 + Math.random() * 15;
        if (this.colorTheme === 'emerald') hue = 140 + Math.random() * 30;
        else if (this.colorTheme === 'saffron') hue = 28 + Math.random() * 18;
        else if (this.colorTheme === 'ruby') hue = 355 + Math.random() * 20;

        return {
          ...base,
          size: Math.random() * 2.2 + 0.5,
          speedX: (Math.random() - 0.5) * 0.3,
          speedY: (Math.random() - 0.5) * 0.2 - 0.1,
          opacity: Math.random() * 0.4 + 0.1,
          hue: hue
        };
      }
    }

    update(p) {
      p.life++;

      if (this.preset === 'seed-drift') {
        p.x += p.speedX;
        p.y += p.speedY;
        p.angle += p.rotSpeed;
      } else if (this.preset === 'leaf-swirl') {
        p.x += p.speedX + Math.sin(p.life * p.swayFreq) * p.swayAmp;
        p.y += p.speedY;
        p.angle += p.rotSpeed;
      } else if (this.preset === 'saffron-embers') {
        p.x += p.speedX + Math.sin(p.life * 0.02) * 0.4;
        p.y += p.speedY;
      } else if (this.preset === 'desert-sand') {
        p.x += p.speedX;
        p.y += p.speedY;
      } else {
        p.x += p.speedX + Math.sin(p.life * 0.01) * 0.1;
        p.y += p.speedY;
      }

      // Fade envelope
      const progress = p.life / p.maxLife;
      if (progress < 0.1) {
        p.currentOpacity = p.opacity * (progress / 0.1);
      } else if (progress > 0.8) {
        p.currentOpacity = p.opacity * ((1 - progress) / 0.2);
      } else {
        p.currentOpacity = p.opacity;
      }

      // Reset when offscreen or expired
      if (p.life >= p.maxLife || p.x < -25 || p.x > this.w + 25 || p.y < -25 || p.y > this.h + 25) {
        Object.assign(p, this.createParticle());
        if (this.preset === 'saffron-embers') {
          p.y = this.h + 10; // re-enter from bottom
        } else if (this.preset === 'desert-sand') {
          p.x = -10;
          p.y = Math.random() * this.h;
        } else {
          p.y = -10; // re-enter from top
        }
        p.life = 0;
      }
    }

    draw(p) {
      const ctx = this.ctx;
      ctx.save();
      ctx.translate(p.x, p.y);

      if (this.preset === 'seed-drift') {
        ctx.rotate(p.angle);
        if (p.type === 'kalonji') {
          // Angular triangular jet-black seed with subtle gold edge
          ctx.beginPath();
          ctx.moveTo(0, -p.size);
          ctx.lineTo(p.size * 0.7, p.size * 0.8);
          ctx.lineTo(-p.size * 0.7, p.size * 0.8);
          ctx.closePath();
          ctx.fillStyle = `rgba(20, 16, 12, ${p.currentOpacity})`;
          ctx.strokeStyle = `rgba(196, 134, 11, ${p.currentOpacity * 0.4})`;
          ctx.lineWidth = 0.5;
          ctx.fill();
          ctx.stroke();
        } else {
          // Warm striped Ajwain oval seed
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size * 0.6, p.size, 0, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(184, 92, 56, ${p.currentOpacity * 0.85})`;
          ctx.fill();
        }
      } else if (this.preset === 'leaf-swirl') {
        ctx.rotate(p.angle);
        // Stylized botanical leaf shape
        ctx.beginPath();
        ctx.moveTo(0, -p.size * 1.4);
        ctx.quadraticCurveTo(p.size * 0.9, 0, 0, p.size * 1.4);
        ctx.quadraticCurveTo(-p.size * 0.9, 0, 0, -p.size * 1.4);
        ctx.closePath();
        ctx.fillStyle = `hsla(${p.hue}, 45%, 38%, ${p.currentOpacity})`;
        ctx.fill();
      } else if (this.preset === 'saffron-embers') {
        // Glowing ember with soft radial glow
        const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size * 1.8);
        glow.addColorStop(0, `hsla(${p.hue}, 95%, 65%, ${p.currentOpacity})`);
        glow.addColorStop(1, `hsla(${p.hue}, 85%, 45%, 0)`);
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(0, 0, p.size * 1.8, 0, Math.PI * 2);
        ctx.fill();
      } else if (this.preset === 'starlight-nebula') {
        // Twinkling cross sparkle
        ctx.fillStyle = `hsla(${p.hue}, 80%, 75%, ${p.currentOpacity})`;
        ctx.beginPath();
        ctx.arc(0, 0, p.size * 0.8, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Gold dust / Sand orb
        ctx.beginPath();
        ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 75%, 55%, ${p.currentOpacity})`;
        ctx.fill();
      }

      ctx.restore();
    }

    animate() {
      if (!this.isActive) return;
      this.ctx.clearRect(0, 0, this.w, this.h);
      for (let i = 0; i < this.particles.length; i++) {
        this.update(this.particles[i]);
        this.draw(this.particles[i]);
      }
      this.animId = requestAnimationFrame(this.animate);
    }

    start() {
      if (this.isActive) return;
      this.isActive = true;
      this.animate();
    }

    stop() {
      this.isActive = false;
      if (this.animId) {
        cancelAnimationFrame(this.animId);
        this.animId = null;
      }
    }

    destroy() {
      this.stop();
      if (this.observer) this.observer.disconnect();
      window.removeEventListener('resize', this.resize);
    }
  }

  /* ──────────────────────────────────────────────────────────
     2. 3D INTERACTIVE CARD TILT
     Adds subtle tactile depth & specular reflection
     ────────────────────────────────────────────────────────── */
  function initCardTilt(selector = '[data-tilt]') {
    if (prefersReducedMotion) return;

    const cards = document.querySelectorAll(selector);
    cards.forEach(card => {
      card.style.transformStyle = 'preserve-3d';
      card.style.transition = 'transform 0.2s cubic-bezier(0.25, 1, 0.5, 1)';

      let bounds = null;

      function onMouseEnter() {
        bounds = card.getBoundingClientRect();
      }

      function onMouseMove(e) {
        if (!bounds) bounds = card.getBoundingClientRect();
        const x = e.clientX - bounds.left;
        const y = e.clientY - bounds.top;
        const centerX = bounds.width / 2;
        const centerY = bounds.height / 2;

        const rotateX = ((y - centerY) / centerY) * -7; // max 7 deg
        const rotateY = ((x - centerX) / centerX) * 7;

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
      }

      function onMouseLeave() {
        bounds = null;
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      }

      card.addEventListener('mouseenter', onMouseEnter);
      card.addEventListener('mousemove', onMouseMove);
      card.addEventListener('mouseleave', onMouseLeave);
    });
  }

  /* ──────────────────────────────────────────────────────────
     3. AUTO-INITIALIZER
     ────────────────────────────────────────────────────────── */
  function autoInit() {
    // Particle canvases
    const canvases = document.querySelectorAll('canvas[data-particle-preset], canvas[data-spice-canvas]');
    canvases.forEach(c => new ParticleCanvas(c));

    // 3D Tilt
    initCardTilt('[data-tilt]');
  }

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', autoInit);
    } else {
      autoInit();
    }
  }

  return {
    ParticleCanvas,
    initCardTilt,
    autoInit
  };
}));
