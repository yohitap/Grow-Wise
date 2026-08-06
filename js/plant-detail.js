/**
 * GrowWise — Plant Detail page logic
 * Renders a full care guide for the plant selected via ?id= query param.
 * Uses localStorage for favorites.
 */

'use strict';

const PlantDetail = {
  FAVORITES_KEY: 'growwise.favorites',

  init() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const plant = id ? PlantDB.byId(id) : null;

    if (!plant) {
      document.getElementById('plant-detail').innerHTML = `
        <div class="container" style="text-align:center;padding-block:var(--space-4xl);">
          <div style="font-size:3rem;margin-bottom:var(--space-md);">🪴</div>
          <h1 class="section__title">Plant not found</h1>
          <p style="color:var(--color-text-muted);margin-bottom:var(--space-xl);">
            We couldn't find that plant in our encyclopedia.
          </p>
          <a href="encyclopedia.html" class="btn btn--primary">Browse Encyclopedia</a>
        </div>`;
      return;
    }

    this.render(plant);
    this.initFavorite(plant);
    this.renderRelated(plant);
  },

  getFavorites() {
    try {
      return JSON.parse(localStorage.getItem(this.FAVORITES_KEY)) || [];
    } catch (e) {
      return [];
    }
  },

  render(plant) {
    const root = document.getElementById('plant-detail');
    root.innerHTML = `
      <div class="container">
        <nav aria-label="Breadcrumb" style="margin-bottom:var(--space-lg);font-size:0.875rem;color:var(--color-text-muted);">
          <a href="encyclopedia.html" class="dash-panel__action">Encyclopedia</a>
          <span aria-hidden="true"> / </span>
          <a href="encyclopedia.html" class="dash-panel__action" style="text-transform:capitalize;">${plant.category}</a>
          <span aria-hidden="true"> / </span>
          <span>${plant.name}</span>
        </nav>

        <div class="plant-detail__grid">
          <aside class="plant-detail__visual">
            <div class="card plant-detail__card">
              <div class="plant-detail__emoji" aria-hidden="true">${plant.emoji}</div>
              <h1 class="plant-detail__visual-name">${plant.name}</h1>
              <div class="plant-detail__visual-sci">${plant.scientific}</div>
              <div class="plant-detail__badges">
                <span class="plant-detail__badge">${plant.category}</span>
                <span class="plant-detail__badge">${plant.difficulty}</span>
              </div>
              <button class="plant-detail__favorite" id="fav-toggle" data-id="${plant.id}" type="button">
                <span id="fav-icon" aria-hidden="true">☆</span>
                <span id="fav-label">Save to favorites</span>
              </button>
            </div>
          </aside>

          <div class="plant-detail__info">
            <section class="plant-detail__section">
              <h2 class="plant-detail__section-title"><span aria-hidden="true">🌱</span> About ${plant.name}</h2>
              <p class="plant-detail__desc">${plant.description}</p>
            </section>

            <section class="plant-detail__section">
              <h2 class="plant-detail__section-title"><span aria-hidden="true">⚙️</span> Quick Specs</h2>
              <div class="plant-detail__specs">
                <div class="spec"><div class="spec__icon" aria-hidden="true">☀️</div><div><div class="spec__label">Sunlight</div><div class="spec__value">${plant.sunlight}</div></div></div>
                <div class="spec"><div class="spec__icon" aria-hidden="true">💧</div><div><div class="spec__label">Watering</div><div class="spec__value">${plant.water}</div></div></div>
                <div class="spec"><div class="spec__icon" aria-hidden="true">🌍</div><div><div class="spec__label">Soil</div><div class="spec__value">${plant.soil}</div></div></div>
                <div class="spec"><div class="spec__icon" aria-hidden="true">🧪</div><div><div class="spec__label">Fertilizer</div><div class="spec__value">${plant.fertilizer}</div></div></div>
                <div class="spec"><div class="spec__icon" aria-hidden="true">📅</div><div><div class="spec__label">Season</div><div class="spec__value">${plant.season}</div></div></div>
                <div class="spec"><div class="spec__icon" aria-hidden="true">⏳</div><div><div class="spec__label">Growth Time</div><div class="spec__value">${plant.growthTime}</div></div></div>
              </div>
            </section>

            <section class="plant-detail__section">
              <h2 class="plant-detail__section-title"><span aria-hidden="true">🧑‍🌾</span> How to Grow</h2>
              <div class="care-list">
                ${plant.care.map((item) => `
                  <div class="care-list__item">
                    <span class="care-list__check" aria-hidden="true">✓</span>
                    <span>${item}</span>
                  </div>`).join('')}
              </div>
            </section>

            <section class="plant-detail__section">
              <h2 class="plant-detail__section-title"><span aria-hidden="true">🍂</span> Harvest &amp; Common Pests</h2>
              <div class="plant-detail__specs">
                <div class="spec"><div class="spec__icon" aria-hidden="true">✂️</div><div><div class="spec__label">Harvest</div><div class="spec__value">${plant.harvest}</div></div></div>
                <div class="spec"><div class="spec__icon" aria-hidden="true">🐛</div><div><div class="spec__label">Watch out for</div><div class="spec__value">${plant.pests}</div></div></div>
              </div>
            </section>
          </div>
        </div>

        <section class="related-plants">
          <h2 class="related-plants__title">More ${PlantDB.categoryLabel(plant.category)} to Explore</h2>
          <div class="plant-grid" id="related-grid"></div>
        </section>
      </div>`;
  },

  initFavorite(plant) {
    const toggle = document.getElementById('fav-toggle');
    const favorites = this.getFavorites();
    const isFav = favorites.includes(plant.id);
    this.updateFavUI(isFav);

    toggle.addEventListener('click', () => {
      let favs = this.getFavorites();
      const already = favs.includes(plant.id);
      if (already) {
        favs = favs.filter((f) => f !== plant.id);
      } else {
        favs.push(plant.id);
      }
      localStorage.setItem(this.FAVORITES_KEY, JSON.stringify(favs));
      this.updateFavUI(!already);
    });
  },

  updateFavUI(isFav) {
    const icon = document.getElementById('fav-icon');
    const label = document.getElementById('fav-label');
    const toggle = document.getElementById('fav-toggle');
    if (!icon || !label || !toggle) return;
    icon.textContent = isFav ? '★' : '☆';
    label.textContent = isFav ? 'Saved to favorites' : 'Save to favorites';
    toggle.classList.toggle('is-fav', isFav);
  },

  renderRelated(plant) {
    const grid = document.getElementById('related-grid');
    const related = PLANTS.filter((p) => p.category === plant.category && p.id !== plant.id).slice(0, 3);

    if (!related.length) {
      const others = PLANTS.filter((p) => p.id !== plant.id).slice(0, 3);
      this.renderCards(grid, others);
    } else {
      this.renderCards(grid, related);
    }
  },

  renderCards(grid, plants) {
    grid.innerHTML = plants
      .map(
        (p) => `
          <article class="card plant-card">
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
  }
};

document.addEventListener('DOMContentLoaded', () => PlantDetail.init());