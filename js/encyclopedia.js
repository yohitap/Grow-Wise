/**
 * GrowWise — Encyclopedia page logic
 * Handles searching, category filtering, and rendering of plant cards.
 */

'use strict';

const Encyclopedia = {
  state: {
    query: '',
    category: 'all'
  },

  els: {
    grid: null,
    chips: null,
    search: null,
    clear: null,
    count: null,
    activeFilter: null,
    empty: null
  },

  init() {
    this.els.grid = document.getElementById('plant-grid');
    this.els.chips = document.getElementById('filter-chips');
    this.els.search = document.getElementById('plant-search');
    this.els.clear = document.getElementById('search-clear');
    this.els.count = document.getElementById('result-count');
    this.els.activeFilter = document.getElementById('active-filter');
    this.els.empty = document.getElementById('empty-state');

    if (!this.els.grid) return;

    this.renderChips();
    this.els.chips.addEventListener('click', (e) => this.onChipClick(e));
    this.els.search.addEventListener('input', (e) => this.onSearch(e));
    this.els.clear.addEventListener('click', () => this.resetSearch());
    document.getElementById('empty-reset').addEventListener('click', () => this.resetSearch());

    this.render();
  },

  renderChips() {
    this.els.chips.innerHTML = PLANT_CATEGORIES.map(
      (cat) => `
        <button class="filter-chip${cat.id === 'all' ? ' is-active' : ''}" data-category="${cat.id}" type="button">
          <span>${cat.icon}</span> ${cat.label}
        </button>`
    ).join('');
  },

  onChipClick(e) {
    const chip = e.target.closest('.filter-chip');
    if (!chip) return;
    this.state.category = chip.dataset.category;
    this.els.chips.querySelectorAll('.filter-chip').forEach((c) =>
      c.classList.toggle('is-active', c === chip)
    );
    this.render();
  },

  onSearch(e) {
    this.state.query = e.target.value;
    this.els.clear.style.opacity = this.state.query ? '1' : '0';
    this.render();
  },

  clearSearch() {
    this.state.query = '';
    if (this.els.clear) this.els.clear.style.opacity = '0';
    this.els.search.value = '';
    this.render();
  },

  getResults() {
    let results = PlantDB.search(this.state.query);
    if (this.state.category !== 'all') {
      results = results.filter((p) => p.category === this.state.category);
    }
    return results;
  },

  render() {
    const results = this.getResults();
    const categoryName = PlantDB.categoryLabel(this.state.category);

    this.els.count.textContent = `${results.length} plant${results.length === 1 ? '' : 's'}`;
    this.els.activeFilter.textContent = this.state.category === 'all' ? 'Showing all categories' : `Category: ${categoryName}`;
    this.els.empty.classList.toggle('is-visible', results.length === 0);

    if (results.length === 0) {
      this.els.grid.innerHTML = '';
      return;
    }

    this.els.grid.innerHTML = results
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
                <span class="plant-card__chip">💧 ${p.water}</span>
              </div>
              <a class="plant-card__link" href="plant-detail.html?id=${p.id}">
                View care guide
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </article>`
      )
      .join('');

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
    this.els.grid.querySelectorAll('.animate-on-scroll').forEach((el) => observer.observe(el));
    this.els.clear.style.display = this.state.query ? 'flex' : 'none';
  }
};

document.addEventListener('DOMContentLoaded', () => Encyclopedia.init());