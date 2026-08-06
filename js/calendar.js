/**
 * GrowWise — Seasonal Calendar page logic
 * Maps each month to its growing season and the plants that should
 * be sown/harvested, driven by the shared PlantDB.
 */

'use strict';

const Calendar = {
  MONTHS: [
    { name: 'January', short: 'Jan', season: 'Winter', emoji: '❄️' },
    { name: 'February', short: 'Feb', season: 'Winter → Spring', emoji: '🌱' },
    { name: 'March', short: 'Mar', season: 'Spring', emoji: '🌸' },
    { name: 'April', short: 'Apr', season: 'Spring → Summer', emoji: '🌷' },
    { name: 'May', short: 'May', season: 'Summer', emoji: '☀️' },
    { name: 'June', short: 'Jun', season: 'Early Monsoon', emoji: '🌦️' },
    { name: 'July', short: 'Jul', season: 'Monsoon', emoji: '🌧️' },
    { name: 'August', short: 'Aug', season: 'Monsoon', emoji: '🌧️' },
    { name: 'September', short: 'Sep', season: 'Monsoon → Autumn', emoji: '🍂' },
    { name: 'October', short: 'Oct', season: 'Autumn', emoji: '🍂' },
    { name: 'November', short: 'Nov', season: 'Autumn → Winter', emoji: '🍁' },
    { name: 'December', short: 'Dec', season: 'Winter', emoji: '❄️' }
  ],

  TIPS: {
    0: { title: 'Water less, plan more', text: 'Winter mornings are chilly — water in the late morning when the soil has warmed. Start chilli, tomato and basil seeds indoors for an early spring head start.' },
    1: { title: 'Seed-starting month', text: 'This is the best month to start summer vegetables from seed — tomatoes, brinjal and chillies. Keep seedlings in bright, warm spots and harden them before transplanting.' },
    2: { title: 'Prepare summer beds', text: 'Mix compost into your pots and grow-bags now. Prune overgrown herbs and top up mulch to lock in moisture for the coming heat.' },
    3: { title: 'Plant warm-season crops', text: 'Tomatoes, chillies and marigolds go into their final containers this month. Support tomatoes early with stakes to avoid surprises later.' },
    4: { title: 'Beat the heat', text: 'Water deeply in the early morning and shade pots from harsh afternoon sun. Group plants together and mulch heavily to cut evaporation.' },
    5: { title: 'Monsoon preparation', text: 'Clean drainage holes and lift pots slightly off the ground. Preempt fungal disease by watering the base and pruning any overcrowded foliage.' },
    6: { title: 'Leafy greens return', text: 'With monsoon rain, sow spinach, coriander and herbs again. Watch for snails and slugs — check plants in the cool evening and pick off pests by hand.' },
    7: { title: 'Feast of greens', text: 'Monsoon growth is fast. Harvest leafy greens regularly and feed with a weak compost tea every 2 weeks. Keep an eye out for fungal spots on leaves.' },
    8: { title: 'Flower power', text: 'Plant marigolds and ornamental annuals for a colorful autumn. Divide crowded ferns and perennials while the soil is soft.' },
    9: { title: 'Welcome the cool season', text: 'Sow winter greens — spinach, coriander, lettuce and carrots. Clear spent summer plants and refresh potting soil with compost.' },
    10: { title: 'Winter garden begins', text: 'The classic Indian winter garden month — plant leafy greens, radish and strawberries. Top-dress pots with compost before the cold deepens.' },
    11: { title: 'Protect from frost', text: 'Move tender plants to sheltered, sunnier spots. Water sparingly, and reduce feeding. It\'s a good time to plan next spring\'s layout.' }
  },

  SPOTLIGHTS: ['spinach', 'chilli', 'tomato', 'marigold', 'tulsi', 'basil', 'mint', 'coriander', 'rose', 'carrot', 'strawberry', 'aloe-vera'],

  currentMonth: null,
  els: {},

  init() {
    this.els.switcher = document.getElementById('month-switcher');
    this.els.monthTitle = document.getElementById('month-title');
    this.els.seasonTag = document.getElementById('season-tag');
    this.els.plants = document.getElementById('month-plants');
    this.els.sectionTitle = document.getElementById('plant-section-title');
    this.els.tipTitle = document.getElementById('tip-title');
    this.els.tipText = document.getElementById('tip-text');

    this.currentMonth = new Date().getMonth();
    this.renderSwitcher();
    this.bindNav();
    this.renderMonth(this.currentMonth);
  },

  renderSwitcher() {
    this.els.switcher.innerHTML = this.MONTHS.map(
      (m, i) => `<button class="month-chip" data-month="${i}" type="button">${m.short}</button>`
    ).join('');
    this.els.switcher.addEventListener('click', (e) => {
      const chip = e.target.closest('.month-chip');
      if (!chip) return;
      this.renderMonth(parseInt(chip.dataset.month, 10));
    });
  },

  bindNav() {
    document.getElementById('prev-month').addEventListener('click', () => {
      this.renderMonth((this.currentMonth + 11) % 12);
    });
    document.getElementById('next-month').addEventListener('click', () => {
      this.renderMonth((this.currentMonth + 1) % 12);
    });
  },

  seasonKeywords(season) {
    const s = season.toLowerCase();
    const set = new Set();
    if (s.includes('year-round')) return new Set([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
    if (s.includes('winter')) [0, 1, 10, 11].forEach((m) => set.add(m));
    if (s.includes('spring')) [1, 2, 3].forEach((m) => set.add(m));
    if (s.includes('summer')) [3, 4, 5, 6].forEach((m) => set.add(m));
    if (s.includes('monsoon')) [6, 7, 8].forEach((m) => set.add(m));
    if (s.includes('autumn') || s.includes('fall')) [9, 10].forEach((m) => set.add(m));
    return set;
  },

  plantsForMonth(month) {
    return PLANTS.filter((p) => this.seasonKeywords(p.season).has(month));
  },

  renderMonth(month) {
    this.currentMonth = month;
    const m = this.MONTHS[month];

    this.els.switcher.querySelectorAll('.month-chip').forEach((c) =>
      c.classList.toggle('is-active', parseInt(c.dataset.month, 10) === month)
    );

    this.els.monthTitle.textContent = `${m.emoji} ${m.name}`;
    this.els.seasonTag.textContent = `${m.emoji} ${m.season}`;

    const tip = this.TIPS[month];
    this.els.tipTitle.textContent = tip.title;
    this.els.tipText.textContent = tip.text;

    const spotlight = PlantDB.byId(this.SPOTLIGHTS[month]);
    this.els.sectionTitle.textContent = `Sow & Grow in ${m.name}`;

    const plants = this.plantsForMonth(month);
    this.els.plants.innerHTML = plants
      .map(
        (p) => `
          <article class="card plant-card animate-on-scroll">
            <div class="plant-card__thumb" style="background:${p.gradient}">
              <span aria-hidden="true">${p.emoji}</span>
              <span class="plant-card__cat">${p.category}</span>
            </div>
            <div class="plant-card__body">
              <h3 class="plant-card__name">${p.name}</h3>
              <div class="plant-card__scientific">${p.scientific}</div>
              <p class="plant-card__desc">${p.description}</p>
              <div class="plant-card__meta">
                <span class="plant-card__chip">☀️ ${p.sunlight.split(',')[0]}</span>
                <span class="plant-card__chip">⏳ ${p.growthTime}</span>
              </div>
              <a class="plant-card__link" href="plant-detail.html?id=${p.id}">
                View care guide <span aria-hidden="true">→</span>
              </a>
            </div>
          </article>`
      )
      .join('');

    if (spotlight) {
      this.els.plants.innerHTML += `
        <article class="card plant-card animate-on-scroll">
          <div class="plant-card__thumb" style="background:${spotlight.gradient}">
            <span aria-hidden="true">${spotlight.emoji}</span>
            <span class="plant-card__cat">⭐ Spotlight</span>
          </div>
          <div class="plant-card__body">
            <h3 class="plant-card__name">${spotlight.name}</h3>
            <div class="plant-card__scientific">${spotlight.scientific}</div>
            <p class="plant-card__desc">${spotlight.description}</p>
            <div class="plant-card__meta">
              <span class="plant-card__chip">☀️ ${spotlight.sunlight.split(',')[0]}</span>
              <span class="plant-card__chip">📅 ${spotlight.season}</span>
            </div>
            <a class="plant-card__link" href="plant-detail.html?id=${spotlight.id}">
              View care guide <span aria-hidden="true">→</span>
            </a>
          </div>
        </article>`;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add('is-visible');
            observer.unobserve(en.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    this.els.plants.querySelectorAll('.animate-on-scroll').forEach((el) => observer.observe(el));
  }
};

document.addEventListener('DOMContentLoaded', () => Calendar.init());