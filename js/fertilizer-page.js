/**
 * GrowWise — Fertilizer Library page logic
 * Search + category filtering over the FERTILIZERS data.
 */

'use strict';

const FertilizerPage = {
  state: { query: '', category: 'all' },
  els: {},

  init() {
    this.els.grid = document.getElementById('fert-grid');
    this.els.chips = document.getElementById('fert-chips');
    this.els.search = document.getElementById('fert-search');
    this.els.clear = document.getElementById('fert-clear');
    this.els.count = document.getElementById('fert-count');

    if (!this.els.grid) return;

    this.renderChips();
    this.els.chips.addEventListener('click', (e) => this.onChip(e));
    this.els.search.addEventListener('input', () => {
      this.state.query = this.els.search.value;
      this.els.clear.style.opacity = this.state.query ? '1' : '0';
      this.render();
    });
    this.els.clear.addEventListener('click', () => {
      this.state.query = '';
      this.els.search.value = '';
      this.els.clear.style.opacity = '0';
      this.render();
    });

    this.render();
  },

  renderChips() {
    this.els.chips.innerHTML = FERTILIZER_CATEGORIES.map(
      (c) => `
        <button class="filter-chip${c.id === 'all' ? ' is-active' : ''}" data-category="${c.id}" type="button">
          <span>${c.icon}</span> ${c.label}
        </button>`
    ).join('');
  },

  onChip(e) {
    const chip = e.target.closest('.filter-chip');
    if (!chip) return;
    this.state.category = chip.dataset.category;
    this.els.chips.querySelectorAll('.filter-chip').forEach((c) =>
      c.classList.toggle('is-active', c === chip)
    );
    this.render();
  },

  getResults() {
    let results = FERTILIZERS;
    const q = this.state.query.trim().toLowerCase();
    if (q) {
      results = results.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.description.toLowerCase().includes(q) ||
          f.bestFor.join(' ').toLowerCase().includes(q)
      );
    }
    if (this.state.category !== 'all') {
      results = results.filter((f) => f.category.toLowerCase() === this.state.category);
    }
    return results;
  },

  render() {
    const results = this.getResults();
    this.els.count.textContent = `${results.length} recipe${results.length === 1 ? '' : 's'}`;

    this.els.grid.innerHTML = results
      .map(
        (f) => `
          <article class="card lib-card animate-on-scroll">
            <div class="lib-card__head" style="background:${f.gradient}">
              <span aria-hidden="true">${f.emoji}</span>
              <span class="lib-card__tag">${f.category}</span>
            </div>
            <div class="lib-card__body">
              <h3 class="lib-card__name">${f.name}</h3>
              <p class="lib-card__desc">${f.description}</p>

              <div class="lib-card__section">
                <div class="lib-card__section-title">What you need</div>
                <ul class="lib-card__section-list">
                  ${f.ingredients.map((i) => `<li>${i}</li>`).join('')}
                </ul>
              </div>

              <div class="lib-card__section">
                <div class="lib-card__section-title">⬆ How to make</div>
                <p class="lib-card__section-text">${f.method.join(' ')}</p>
              </div>

              <div class="lib-card__section">
                <div class="lib-card__section-title">🌱 How to use</div>
                <p class="lib-card__section-text">${f.howToUse}</p>
              </div>

              <div class="lib-card__meta">
                <span class="lib-card__chip">⏰ ${f.frequency}</span>
                <span class="lib-card__chip">💪 ${f.difficulty}</span>
                <span class="lib-card__chip">🎯 ${f.bestFor[0]}</span>
              </div>
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
      { threshold: 0.06 }
    );
    this.els.grid.querySelectorAll('.animate-on-scroll').forEach((el) => observer.observe(el));
    this.els.clear.style.display = this.state.query ? 'flex' : 'none';
  }
};

document.addEventListener('DOMContentLoaded', () => FertilizerPage.init());