/**
 * GrowWise — Dashboard page logic
 * Personalized garden dashboard: stats, today's care plan, favorites,
 * and my-plant tracking. Persists user garden + favorites in localStorage.
 */

'use strict';

const Dashboard = {
  GARDEN_KEY: 'growwise.garden',
  FAVORITES_KEY: 'growwise.favorites',

  init() {
    this.garden = this.load(this.GARDEN_KEY);
    this.favorites = this.load(this.FAVORITES_KEY);

    if (!this.garden.length) {
      this.garden = ['tomato', 'tulsi', 'money-plant', 'basil'];
      this.save(this.GARDEN_KEY, this.garden);
    }
    if (!this.favorites.length) {
      this.favorites = ['tomato', 'mint', 'snake-plant', 'lavender'];
      this.save(this.FAVORITES_KEY, this.favorites);
    }

    this.renderGreeting();
    this.renderStats();
    this.renderCarePlan();
    this.renderMyPlants();
    this.renderFavorites();
  },

  load(key) {
    try {
      return JSON.parse(localStorage.getItem(key)) || [];
    } catch (e) {
      return [];
    }
  },

  save(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },

  timeGreeting() {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  },

  currentUser() {
    try {
      const session = JSON.parse(localStorage.getItem('growwise.auth'));
      return session && session.user ? session.user : null;
    } catch (e) {
      return null;
    }
  },

  renderGreeting() {
    const day = new Date().toLocaleDateString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
    const user = this.currentUser();
    const name = user && user.name ? `, ${user.name.split(' ')[0]}` : '';

    document.getElementById('dash-greeting').textContent = `${this.timeGreeting()}${name} · ${day}`;
    document.getElementById('dash-summary').textContent =
      `${this.garden.length} plants in your garden. ${this.countCareToday()} care tasks scheduled today. Everything looks healthy and thriving.`;

    const heroTitle = document.querySelector('.dash-hero__title');
    if (heroTitle) heroTitle.textContent = `Welcome back to your Garden`;

    const signOut = document.getElementById('sign-out');
    if (signOut) {
      signOut.addEventListener('click', () => {
        localStorage.removeItem('growwise.auth');
        window.location.href = 'login.html';
      });
    }
  },

  renderStats() {
    const plants = this.garden.map((id) => PlantDB.byId(id)).filter(Boolean);
    const healthy = plants.filter(() => Math.random() > 0.15).length;
    const healthPct = plants.length ? Math.round((healthy / plants.length) * 100) : 0;

    document.getElementById('stat-plants').textContent = plants.length;
    document.getElementById('stat-favorites').textContent = this.favorites.length;
    document.getElementById('stat-reminders').textContent = this.countCareToday();
    document.getElementById('stat-health').textContent = healthPct + '%';
  },

  countCareToday() {
    return this.garden.length >= 4 ? 3 : Math.max(1, Math.floor(this.garden.length / 2));
  },

  careSlots() {
    const plan = [
      { label: 'Morning water', icon: '💧', time: '6:00 AM' },
      { label: 'Evening water', icon: '🌙', time: '6:00 PM' },
      { label: 'Compost feed', icon: '🧪', time: 'Feeds due' }
    ];
    const n = this.countCareToday();
    return plan.slice(0, n).map((slot, i) => ({
      ...slot,
      now: i === 0,
      plant: PlantDB.byId(this.garden[i % this.garden.length])
    }));
  },

  renderCarePlan() {
    const list = document.getElementById('care-list');
    const slots = this.careSlots();

    list.innerHTML = slots
      .map(
        (s) => `
          <div class="dash-list__item">
            <div class="dash-list__icon" style="background:${s.plant.gradient}" aria-hidden="true">${s.plant.emoji}</div>
            <div class="dash-list__content">
              <div class="dash-list__name">${s.label} — ${s.plant.name}</div>
              <div class="dash-list__sub">${s.time}</div>
            </div>
            <span class="dash-list__tag ${s.now ? 'dash-list__tag--now' : 'dash-list__tag--soon'}">${s.now ? 'Now' : 'Soon'}</span>
          </div>`
      )
      .join('');
  },

  renderMyPlants() {
    const list = document.getElementById('my-plants');
    list.innerHTML = this.garden
      .map((id) => PlantDB.byId(id))
      .filter(Boolean)
      .map(
        (p) => `
          <a class="dash-list__item" href="plant-detail.html?id=${p.id}" style="text-decoration:none;color:inherit;transition:background var(--transition-fast);">
            <div class="dash-list__icon" style="background:${p.gradient}" aria-hidden="true">${p.emoji}</div>
            <div class="dash-list__content">
              <div class="dash-list__name">${p.name}</div>
              <div class="dash-list__sub">${p.category} · ${p.difficulty}</div>
            </div>
            <span class="dash-list__tag dash-list__tag--now">Healthy</span>
          </a>`
      )
      .join('');
  },

  renderFavorites() {
    const grid = document.getElementById('fav-grid');
    grid.innerHTML = this.favorites
      .map((id) => PlantDB.byId(id))
      .filter(Boolean)
      .map(
        (p) => `
          <a class="dash-mini" href="plant-detail.html?id=${p.id}">
            <div class="dash-mini__icon" aria-hidden="true">${p.emoji}</div>
            <div style="font-weight:600;color:var(--color-primary);font-size:0.9375rem;">${p.name}</div>
            <div class="dash-mini__label">${p.category}</div>
          </a>`
      )
      .join('');
  }
};

document.addEventListener('DOMContentLoaded', () => Dashboard.init());