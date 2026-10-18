/* ============================================================
   MAJESTIC ESSENCE — Animation Engine
   Indian Scripture-Inspired Scroll Reveals, Particles, Parallax
   Vanilla JS — No dependencies
   ============================================================ */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ──────────────────────────────────────────────────────────
     1. NAVIGATION
     ────────────────────────────────────────────────────────── */
  const nav = document.getElementById('mainNav');
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('open');
      navToggle.classList.toggle('active', open);
      navToggle.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('[data-close-menu]').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* ──────────────────────────────────────────────────────────
     2. SCROLL REVEAL — IntersectionObserver
     ────────────────────────────────────────────────────────── */
  function setupScrollReveals() {
    // Reveal sections
    const revealSections = document.querySelectorAll('.reveal-section');
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          sectionObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    revealSections.forEach(el => sectionObserver.observe(el));

    // Reveal text lines
    const revealTexts = document.querySelectorAll('.reveal-text');
    const textObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          textObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -40px 0px' });

    revealTexts.forEach((el, index) => {
      el.style.transitionDelay = `${index * 0.12}s`;
      textObserver.observe(el);
    });

    // Product chapters — border draw + image reveal
    const chapters = document.querySelectorAll('.product-chapter');
    const chapterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          chapterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -80px 0px' });

    chapters.forEach(el => chapterObserver.observe(el));

    // Scripture border lines
    const scriptureLines = document.querySelectorAll('.scripture-line');
    const lineObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          lineObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    scriptureLines.forEach(el => lineObserver.observe(el));
  }

  /* ──────────────────────────────────────────────────────────
     3. WORD-BY-WORD REVEAL
     ────────────────────────────────────────────────────────── */
  function setupWordReveal() {
    const wordGroups = document.querySelectorAll('.brand-story__title');
    const wordObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const words = entry.target.querySelectorAll('.word-reveal');
          words.forEach((word, i) => {
            setTimeout(() => {
              word.classList.add('visible');
            }, i * 80);
          });
          wordObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    wordGroups.forEach(el => wordObserver.observe(el));
  }

  /* ──────────────────────────────────────────────────────────
     4. GOLD DUST PARTICLE SYSTEM
     ────────────────────────────────────────────────────────── */
  function setupParticles() {
    if (prefersReducedMotion) return;

    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;
    let w, h;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resize, { passive: true });
    resize();

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.2 - 0.1;
        this.opacity = Math.random() * 0.4 + 0.1;
        this.hue = 35 + Math.random() * 15; // Gold range
        this.life = 0;
        this.maxLife = 400 + Math.random() * 600;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life++;

        // Gentle wave
        this.x += Math.sin(this.life * 0.01) * 0.1;

        // Fade in and out
        const lifeRatio = this.life / this.maxLife;
        if (lifeRatio < 0.1) {
          this.currentOpacity = this.opacity * (lifeRatio / 0.1);
        } else if (lifeRatio > 0.8) {
          this.currentOpacity = this.opacity * ((1 - lifeRatio) / 0.2);
        } else {
          this.currentOpacity = this.opacity;
        }

        if (this.life >= this.maxLife || this.x < -10 || this.x > w + 10 || this.y < -10 || this.y > h + 10) {
          this.reset();
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue}, 70%, 55%, ${this.currentOpacity})`;
        ctx.fill();
      }
    }

    // Create particles — fewer on mobile
    const count = window.innerWidth < 768 ? 25 : 50;
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }

    function animate() {
      ctx.clearRect(0, 0, w, h);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      animationId = requestAnimationFrame(animate);
    }

    // Only run particles when hero is visible
    const heroEl = document.getElementById('hero');
    let particlesActive = true;

    if (heroEl) {
      const heroObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !particlesActive) {
            particlesActive = true;
            animate();
          } else if (!entry.isIntersecting && particlesActive) {
            particlesActive = false;
            cancelAnimationFrame(animationId);
          }
        });
      }, { threshold: 0 });

      heroObserver.observe(heroEl);
    }

    animate();
  }

  /* ──────────────────────────────────────────────────────────
     5. PARALLAX — Lightweight scroll-based transforms
     ────────────────────────────────────────────────────────── */
  function setupParallax() {
    if (prefersReducedMotion) return;

    const parallaxElements = document.querySelectorAll('.product-chapter__image-wrap');
    let ticking = false;

    function updateParallax() {
      parallaxElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const viewH = window.innerHeight;
        if (rect.top < viewH && rect.bottom > 0) {
          const progress = (viewH - rect.top) / (viewH + rect.height);
          const translate = (progress - 0.5) * 20;
          el.style.transform = `translateY(${translate}px)`;
        }
      });
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });
  }

  /* ──────────────────────────────────────────────────────────
     6. SMOOTH SCROLL for nav links
     ────────────────────────────────────────────────────────── */
  function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          e.preventDefault();
          const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
          const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
    });
  }

  /* ──────────────────────────────────────────────────────────
     7. ACTIVE NAV TRACKING
     ────────────────────────────────────────────────────────── */
  function setupActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__links a');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.style.color = '';
            if (link.getAttribute('href') === `#${id}`) {
              link.style.color = 'var(--c-gold)';
            }
          });
        }
      });
    }, { threshold: 0.3, rootMargin: '-80px 0px -50% 0px' });

    sections.forEach(section => observer.observe(section));
  }

  /* ──────────────────────────────────────────────────────────
     8. MANDALA SCROLL SCALE
     ────────────────────────────────────────────────────────── */
  function setupMandalaScroll() {
    if (prefersReducedMotion) return;

    const mandala = document.querySelector('.hero__mandala');
    if (!mandala) return;

    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const scale = 1 + scrollY * 0.0003;
          const opacity = Math.max(0, 1 - scrollY * 0.002);
          mandala.style.transform = `translate(-50%, -50%) scale(${scale})`;
          mandala.style.opacity = opacity;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ──────────────────────────────────────────────────────────
     9. FAQ ACCORDION (AEO & GEO Citability Support)
     ────────────────────────────────────────────────────────── */
  function setupFaqAccordion() {
    const faqTriggers = document.querySelectorAll('.faq-trigger');
    if (!faqTriggers.length) return;
    faqTriggers.forEach(trigger => {
      trigger.addEventListener('click', () => {
        const item = trigger.closest('.faq-item');
        if (!item) return;
        const isOpen = item.classList.contains('active');
        const parentGrid = item.closest('.faq-grid');
        if (parentGrid) {
          parentGrid.querySelectorAll('.faq-item').forEach(sibling => {
            if (sibling !== item) {
              sibling.classList.remove('active');
              const sibTrigger = sibling.querySelector('.faq-trigger');
              if (sibTrigger) sibTrigger.setAttribute('aria-expanded', 'false');
            }
          });
        }
        if (isOpen) {
          item.classList.remove('active');
          trigger.setAttribute('aria-expanded', 'false');
        } else {
          item.classList.add('active');
          trigger.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  /* ──────────────────────────────────────────────────────────
     INITIALIZE
     ────────────────────────────────────────────────────────── */
  function init() {
    setupScrollReveals();
    setupWordReveal();
    setupParticles();
    setupParallax();
    setupSmoothScroll();
    setupActiveNav();
    setupMandalaScroll();
    setupFaqAccordion();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
