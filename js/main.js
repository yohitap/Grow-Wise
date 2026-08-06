/**
 * GrowWise — Main JavaScript
 * Handles navigation, scroll animations, and interactive UI.
 * Structured for future React/component migration.
 */

'use strict';

/* ============================================
   NAVIGATION MODULE
   ============================================ */
const Navigation = {
  nav: null,
  toggle: null,
  mobileMenu: null,

  init() {
    this.nav = document.querySelector('.nav');
    this.toggle = document.querySelector('.nav__toggle');
    this.mobileMenu = document.querySelector('.nav__mobile');

    if (!this.nav) return;

    this.handleScroll();
    this.handleMobileToggle();
    this.handleMobileLinks();
    window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
  },

  handleScroll() {
    const scrolled = window.scrollY > 50;
    this.nav.classList.toggle('is-scrolled', scrolled);
  },

  handleMobileToggle() {
    if (!this.toggle || !this.mobileMenu) return;

    this.toggle.addEventListener('click', () => {
      const isOpen = this.mobileMenu.classList.toggle('is-open');
      this.toggle.classList.toggle('is-active', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
  },

  handleMobileLinks() {
    if (!this.mobileMenu || !this.toggle) return;

    const links = this.mobileMenu.querySelectorAll('a');
    links.forEach((link) => {
      link.addEventListener('click', () => {
        this.mobileMenu.classList.remove('is-open');
        this.toggle.classList.remove('is-active');
        document.body.style.overflow = '';
      });
    });
  }
};

/* ============================================
   SCROLL ANIMATIONS MODULE
   Uses Intersection Observer for performance.
   ============================================ */
const ScrollAnimations = {
  init() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    elements.forEach((el) => observer.observe(el));
  }
};

/* ============================================
   COUNTER ANIMATION MODULE
   Animates stat numbers when they enter viewport.
   ============================================ */
const CounterAnimation = {
  init() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((counter) => observer.observe(counter));
  },

  animateCounter(element) {
    const target = parseInt(element.dataset.count, 10);
    const suffix = element.dataset.suffix || '';
    const duration = 2000;
    const startTime = performance.now();

    const update = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);

      element.textContent = current.toLocaleString() + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };

    requestAnimationFrame(update);
  }
};

/* ============================================
   SMOOTH SCROLL MODULE
   ============================================ */
const SmoothScroll = {
  init() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();
        const navHeight = document.querySelector('.nav')?.offsetHeight || 0;
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight;

        window.scrollTo({ top, behavior: 'smooth' });
      });
    });
  }
};

/* ============================================
   HERO TYPING ANIMATION
   Simulates AI chatbot typing in hero mockup.
   ============================================ */
const HeroTyping = {
  init() {
    const typingEl = document.querySelector('.hero__chat-typing');
    const aiMessage = document.querySelector('.hero__chat-msg--ai:last-of-type');

    if (!typingEl || !aiMessage) return;

    const messages = [
      'Your tomato plants need watering every 2–3 days. The soil should feel moist about 1 inch deep. Add compost tea this week for better fruiting! 🍅'
    ];

    let charIndex = 0;
    const fullText = messages[0];

    setTimeout(() => {
      typingEl.style.display = 'none';
      aiMessage.style.display = 'block';

      const typeChar = () => {
        if (charIndex < fullText.length) {
          aiMessage.textContent = fullText.substring(0, charIndex + 1);
          charIndex++;
          setTimeout(typeChar, 25);
        }
      };

      typeChar();
    }, 2500);
  }
};

/* ============================================
   PAGE TRANSITIONS MODULE
   Smooth animated movement between pages.
   Overlay slides up from the bottom on load,
   and slides across before navigating away.
   ============================================ */
const PageTransitions = {
  overlay: null,
  active: false,

  init() {
    if (this.overlay) return;
    this.buildOverlay();
    this.bindLinks();
  },

  buildOverlay() {
    this.overlay = document.createElement('div');
    this.overlay.className = 'transition-overlay';
    this.overlay.innerHTML = `
      <div class="transition-overlay__logo">
        <span class="transition-overlay__logo-icon" aria-hidden="true">🌿</span>
        GrowWise
      </div>`;
    document.body.appendChild(this.overlay);
  },

  bindLinks() {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href]');
      if (!link) return;

      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
      if (href.startsWith('http') && new URL(href).origin !== window.location.origin) return;

      const isPageNav = /\.html(?:[?#]|$)/.test(href);
      if (!isPageNav) return;

      if (this.active) return;
      e.preventDefault();

      const target = href.split(/[?#]/)[0];
      const current = window.location.pathname.split('/').pop() || 'index.html';
      if (target === current) return;

      this.active = true;
      this.overlay.classList.add('is-active');
      this.overlay.classList.remove('is-leaving');

      setTimeout(() => {
        window.location.href = href;
      }, 560);
    });
  }
};

/* ============================================
   AUTH UI MODULE
   Reflects the signed-in state in the navigation.
   Shows the user's name + a sign-out button when
   a session exists in localStorage.
   ============================================ */
const AuthUI = {
  AUTH_KEY: 'growwise.auth',

  init() {
    const session = this.getSession();
    if (!session || !session.user) return;
    document.body.classList.add('is-authed');
    this.enhanceNav(session.user);
  },

  getSession() {
    try {
      return JSON.parse(localStorage.getItem(this.AUTH_KEY));
    } catch (e) {
      return null;
    }
  },

  enhanceNav(user) {
    const firstName = (user.name || 'Gardener').split(' ')[0];
    const avatar = (user.name || 'G').charAt(0).toUpperCase();

    const chip = document.createElement('a');
    chip.className = 'user-chip';
    chip.href = 'dashboard.html';
    chip.title = 'Signed in — go to your dashboard';
    chip.innerHTML = `
      <span class="user-chip__avatar">${avatar}</span>
      <span class="user-chip__name">${firstName}</span>
      <span class="user-chip__status">Signed in</span>`;

    const outBtn = document.createElement('button');
    outBtn.className = 'user-chip__out';
    outBtn.type = 'button';
    outBtn.title = 'Sign out';
    outBtn.setAttribute('aria-label', 'Sign out');
    outBtn.innerHTML = '✕';

    document.querySelectorAll('.nav__actions a.btn--ghost').forEach((btn) => {
      const wrap = document.createElement('div');
      wrap.className = 'nav__user';
      wrap.appendChild(chip.cloneNode(true));
      wrap.appendChild(outBtn.cloneNode(true));
      wrap.addEventListener('click', (e) => {
        if (e.target.closest('.user-chip__out')) this.signOut();
      });
      btn.replaceWith(wrap);
    });

    document.querySelectorAll('.nav__mobile a.btn--secondary').forEach((btn) => {
      const link = chip.cloneNode(true);
      link.style.marginTop = '1rem';
      btn.replaceWith(link);
    });
  },

  signOut() {
    localStorage.removeItem(this.AUTH_KEY);
    window.location.reload();
  }
};

/* ============================================
   APP INITIALIZATION
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
  Navigation.init();
  ScrollAnimations.init();
  CounterAnimation.init();
  SmoothScroll.init();
  HeroTyping.init();
  PageTransitions.init();
  AuthUI.init();
});
