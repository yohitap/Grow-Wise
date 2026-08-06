/**
 * GrowWise — Pest & Disease Management page logic
 * Search + type filtering over the PESTS data.
 */

'use strict';

const PestPage = {
  state: { query: '', category: 'all' },
  els: {},

  init() {
    this.els.grid = document.getElementById('pest-grid');
    this.els.chips = document.getElementById('pest-chips');
    this.els.search = document.getElementById('pest-search');
    this.els.clear = document.getElementById('pest-clear');
    this.els.count = document.getElementById('pest-count');

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
    this.els.chips.innerHTML = PEST_CATEGORIES.map(
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
    let results = PESTS;
    const q = this.state.query.trim().toLowerCase();
    if (q) {
      results = results.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.affected.join(' ').toLowerCase().includes(q) ||
          p.symptoms.join(' ').toLowerCase().includes(q)
      );
    }
    if (this.state.category !== 'all') {
      results = results.filter((p) => p.type === this.state.category);
    }
    return results;
  },

  render() {
    const results = this.getResults();
    this.els.count.textContent = `${results.length} ${results.length === 1 ? 'problem' : 'problems'} listed`;

    this.els.grid.innerHTML = results
      .map(
        (p) => `
          <article class="card lib-card animate-on-scroll">
            <div class="lib-card__head" style="background:${p.gradient}">
              <span aria-hidden="true">${p.emoji}</span>
              <span class="lib-card__tag">${p.type}</span>
              <span class="lib-card__severity lib-card__severity--${p.severity}">${p.severity}</span>
            </div>
            <div class="lib-card__body">
              <h3 class="lib-card__name">${p.name}</h3>
              <p class="lib-card__desc">${p.description}</p>

              <div class="lib-card__section">
                <div class="lib-card__section-title">🔎 How to spot it</div>
                <ul class="lib-card__section-list">
                  ${p.symptoms.map((s) => `<li>${s}</li>`).join('')}
                </ul>
              </div>

              <div class="lib-card__section">
                <div class="lib-card__section-title">🌿 Organic treatment</div>
                <ul class="lib-card__section-list">
                  ${p.treatment.map((t) => `<li>${t}</li>`).join('')}
                </ul>
              </div>

              <div class="lib-card__section">
                <div class="lib-card__section-title">🛡️ Prevention</div>
                <ul class="lib-card__section-list">
                  ${p.prevention.map((t) => `<li>${t}</li>`).join('')}
                </ul>
              </div>

              <div class="lib-card__meta">
                <span class="lib-card__chip">🌱 Affects: ${p.affected.slice(0, 2).join(', ')}</span>
                <a href="chatbot.html" class="lib-card__chip" style="color:var(--color-primary-mid);font-weight:600;">Ask AI →</a>
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

document.addEventListener('DOMContentLoaded', () => PestPage.init());