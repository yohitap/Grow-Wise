
'use strict';

const Identify = {
  FAVORITES_KEY: 'growwise.favorites',
  mode: 'identify',
  image: null,

  DISEASES: [
    {
      name: 'Powdery Mildew',
      match: 'White powdery spots on leaves',
      severity: 'Moderate',
      cause: 'High humidity, poor airflow, warm days & cool nights',
      treatment: [
        'Remove and discard the most affected leaves.',
        'Spray a milk-and-water mix (1:9) weekly as a natural fungicide.',
        'Improve air circulation — space pots and prune overcrowded foliage.',
        'Water at the base only; keep leaf surfaces dry.'
      ]
    },
    {
      name: 'Leaf Spot / Black Spot',
      match: 'Dark brown or black round spots',
      severity: 'Moderate',
      cause: 'Fungal spores spread by splashing water',
      treatment: [
        'Strip and dispose of spotted leaves immediately.',
        'Apply neem-oil spray weekly in the cool evening.',
        'Mulch soil so rain doesn\'t splash spores upward.',
        'Give plants good spacing for airflow.'
      ]
    },
    {
      name: 'Downy Mildew',
      match: 'Yellow patches with grey fuzzy undersides',
      severity: 'High',
      cause: 'Cool, damp conditions and crowded planting',
      treatment: [
        'Remove infected foliage and thinner canopy.',
        'Use a baking-soda spray (1 tsp in 1 L water + dash of soap).',
        'Water early in the day so leaves dry out fast.',
        'Switch to drip or base watering.'
      ]
    },
    {
      name: 'Root Rot',
      match: 'Wilting despite wet soil, mushy roots',
      severity: 'Severe',
      cause: 'Overwatering or poor drainage',
      treatment: [
        'Stop watering immediately and check the root ball.',
        'Repot in fresh, gritty, well-draining mix.',
        'Trim away dark, mushy roots with clean scissors.',
        'Let soil dry fully between future waterings.'
      ]
    },
    {
      name: 'Aphid Infestation',
      match: 'Clusters of tiny green/black insects on new growth',
      severity: 'Low',
      cause: 'Soft new growth attracted sap-sucking insects',
      treatment: [
        'Blast insects off with a sharp spray of water.',
        'Apply neem-oil spray every 5–7 days.',
        'Attract ladybirds by growing marigolds nearby.',
        'Check plants weekly, especially under leaves.'
      ]
    },
    {
      name: 'Nutritional Deficiency',
      match: 'General yellowing / pale or droopy leaves',
      severity: 'Low',
      cause: 'Lack of nitrogen, iron, or poor soil',
      treatment: [
        'Feed with a balanced compost tea every 2 weeks.',
        'Top-dress with vermicompost.',
        'Check the soil pH — aim for 6.0–7.0.',
        'For iron, use a chelated iron or neem the soil acidic.'
      ]
    }
  ],

  els: {},

  init() {
    this.els.tabs = document.querySelectorAll('.identify__tab');
    this.els.dropzone = document.getElementById('dropzone');
    this.els.input = document.getElementById('image-input');
    this.els.preview = document.getElementById('preview');
    this.els.previewImg = document.getElementById('preview-img');
    this.els.scanline = document.getElementById('scanline');
    this.els.actions = document.getElementById('actions');
    this.els.analyze = document.getElementById('analyze-btn');
    this.els.reset = document.getElementById('reset-btn');
    this.els.results = document.getElementById('results');
    this.els.progress = document.getElementById('progress');
    this.els.progressFill = document.getElementById('progress-fill');
    this.els.progressText = document.getElementById('progress-text');
    this.els.dropzoneTitle = document.getElementById('dropzone-title');
    this.els.dropzoneText = document.getElementById('dropzone-text');

    this.bindEvents();
  },

  bindEvents() {
    this.els.tabs.forEach((tab) =>
      tab.addEventListener('click', () => this.setMode(tab.dataset.mode))
    );

    this.els.dropzone.addEventListener('click', () => this.els.input.click());
    this.els.dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      this.els.dropzone.classList.add('is-dragging');
    });
    this.els.dropzone.addEventListener('dragleave', () =>
      this.els.dropzone.classList.remove('is-dragging')
    );
    this.els.dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      this.els.dropzone.classList.remove('is-dragging');
      const file = e.dataTransfer.files[0];
      if (file) this.loadFile(file);
    });
    this.els.input.addEventListener('change', (e) => {
      if (e.target.files[0]) this.loadFile(e.target.files[0]);
    });

    this.els.analyze.addEventListener('click', () => this.analyze());
    this.els.reset.addEventListener('click', () => this.reset());

    this.els.results.addEventListener('click', (e) => {
      const card = e.target.closest('.match-card[data-id]');
      if (card) this.showPlantResult(card.dataset.id);
      const fav = e.target.closest('[data-fav]');
      if (fav) this.toggleFav(fav.dataset.fav);
    });
  },

  setMode(mode) {
    this.mode = mode;
    this.els.tabs.forEach((t) =>
      t.classList.toggle('is-active', t.dataset.mode === mode)
    );
    this.reset();

    const isId = mode === 'identify';
    this.els.dropzoneTitle.textContent = isId
      ? 'Upload a plant photo'
      : 'Upload a photo of the affected leaf';
    this.els.dropzoneText.textContent = isId
      ? 'Drag & drop your image here, or click to browse. JPG or PNG, up to 10 MB.'
      : 'Capture a clear, well-lit shot of the damaged leaf. JPG or PNG, up to 10 MB.';
    this.els.analyze.textContent = isId ? '🔍 Identify Plant' : '🩺 Run Disease Check';
  },

  loadFile(file) {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      this.image = e.target.result;
      this.els.previewImg.src = this.image;
      this.els.preview.classList.add('is-visible');
      this.els.scanline.style.display = 'none';
      this.els.results.classList.remove('is-visible');
      this.els.progress.classList.remove('is-visible');
      this.els.analyze.disabled = false;
      this.els.dropzone.style.display = 'none';
      this.els.actions.style.display = 'flex';
    };
    reader.readAsDataURL(file);
  },

  reset() {
    this.image = null;
    this.els.input.value = '';
    this.els.preview.classList.remove('is-visible');
    this.els.previewImg.src = '';
    this.els.results.classList.remove('is-visible');
    this.els.results.innerHTML = '';
    this.els.progress.classList.remove('is-visible');
    this.els.dropzone.style.display = '';
    this.els.previewImg.src = '';
  },

  resetButtons() {
    const a = document.getElementById('analyze-btn');
    const r = document.getElementById('reset-btn');
    if (a) a.disabled = false;
    if (r) r.disabled = false;
  },

  async analyze() {
    if (!this.image) {
      this.els.dropzone.style.display = '';
      return;
    }

    this.els.analyze.disabled = true;
    this.els.reset.disabled = true;
    this.els.results.classList.remove('is-visible');
    this.els.progress.classList.add('is-visible');
    this.els.scanline.style.display = 'block';
    this.els.progressFill.style.width = '0%';

    const stages = ['Loading image…', 'Detecting plant features…', 'Matching species…', 'Finalizing results…'];
    for (let i = 0; i <= 100; i += 4) {
      this.els.progressFill.style.width = i + '%';
      this.els.progressText.textContent = stages[Math.min(3, Math.floor(i / 34))];
      await this.delay(30);
    }

    window.setTimeout(() => {
      this.els.scanline.style.display = 'none';
      this.els.progress.classList.remove('is-visible');
      this.mode === 'identify'
        ? this.renderIdentifyResults()
        : this.renderDiseaseResults();
      this.els.analyze.disabled = false;
      this.els.reset.disabled = false;
    }, 400);
  },

  renderIdentifyResults() {
    const candidates = [...PLANTS]
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map((p, i) => ({ ...p, confidence: Math.round(88 - i * 9 - Math.random() * 6) }));

    this.els.results.innerHTML = `
      <header class="section__header" style="margin-bottom:var(--space-xl);">
        <span class="section__label">✨ Analysis Complete</span>
        <h2 class="section__title">Top Matches</h2>
        <p class="section__subtitle">Best guesses based on visible features. Tap a match to see its care guide.</p>
      </header>
      ${candidates
        .map(
          (p) => `
            <article class="match-card" data-id="${p.id}">
              <div class="match-card__thumb" style="background:${p.gradient}" aria-hidden="true">${p.emoji}</div>
              <div class="match-card__body">
                <div class="match-card__name">${p.name}</div>
                <div class="match-card__sci">${p.scientific}</div>
              </div>
              <div class="match-card__confidence">
                <div class="match-card__pct">${p.confidence}%</div>
                <div class="match-card__label">confidence</div>
              </div>
            </article>`
        )
        .join('')}
      <p style="text-align:center;color:var(--color-text-muted);font-size:0.875rem;margin-top:var(--space-lg);">
        The lookalike matches are a demo of the AI flow — a live server will return exact results via the Plant.id API.
      </p>`;
    this.els.results.classList.add('is-visible');
    this.els.results.scrollIntoView({ behavior: 'smooth', block: 'start' });
  },

  showPlantResult(id) {
    const p = PlantDB.byId(id);
    if (!p) return;
    const favs = this.getFavorites();
    const isFav = favs.includes(p.id);

    this.els.results.innerHTML = `
      <div class="identify__result-card">
        <div style="display:flex;align-items:flex-start;gap:var(--space-lg);flex-wrap:wrap;">
          <div class="plant-detail__emoji" style="font-size:3.5rem;margin-bottom:0;" aria-hidden="true">${p.emoji}</div>
          <div style="flex:1;min-width:220px;">
            <div class="identify__result-title">${p.name}</div>
            <div class="match-card__sci">${p.scientific} · ${p.category} · ${p.difficulty}</div>
          </div>
          <button class="plant-detail__favorite ${isFav ? 'is-fav' : ''}" data-fav="${p.id}" type="button">
            <span aria-hidden="true">${isFav ? '★' : '☆'}</span>
            <span>${isFav ? 'Saved' : 'Save to favorites'}</span>
          </button>
        </div>
        <p class="identify__result-text" style="margin-top:var(--space-lg);">${p.description}</p>
        <div class="plant-detail__specs" style="margin-top:var(--space-lg);">
          <div class="spec"><div class="spec__icon" aria-hidden="true">☀️</div><div><div class="spec__label">Sunlight</div><div class="spec__value">${p.sunlight}</div></div></div>
          <div class="spec"><div class="spec__icon" aria-hidden="true">💧</div><div><div class="spec__label">Watering</div><div class="spec__value">${p.water}</div></div></div>
        </div>
        <div style="margin-top:var(--space-lg);display:flex;gap:var(--space-md);flex-wrap:wrap;">
          <a href="plant-detail.html?id=${p.id}" class="btn btn--primary">View Full Care Guide →</a>
          <button class="btn btn--secondary" id="back-matches" type="button">← All matches</button>
        </div>
      </div>`;
    this.els.results.scrollIntoView({ behavior: 'smooth', block: 'start' });

    document.getElementById('back-matches').addEventListener('click', () => this.renderIdentifyResults());
  },

  renderDiseaseResults() {
    const diagnosis = this.DISEASES[Math.floor(Math.random() * this.DISEASES.length)];
    const confidence = Math.round(78 + Math.random() * 16);

    this.els.results.innerHTML = `
      <div class="identify__result-card">
        <header class="section__header" style="text-align:left;margin:0 0 var(--space-lg);">
          <span class="section__label">🩺 Analysis Complete</span>
          <h2 class="section__title" style="font-size:1.75rem;">Likely: ${diagnosis.name}</h2>
          <p style="color:var(--color-text-muted);">Detected with <strong>${confidence}%</strong> confidence · Severity: <strong>${diagnosis.severity}</strong></p>
        </header>

        <div class="plant-detail__specs">
          <div class="spec"><div class="spec__icon" aria-hidden="true">🔍</div><div><div class="spec__label">Symptom</div><div class="spec__value">${diagnosis.match}</div></div></div>
          <div class="spec"><div class="spec__icon" aria-hidden="true">🌡️</div><div><div class="spec__label">Likely cause</div><div class="spec__value">${diagnosis.cause}</div></div></div>
        </div>

        <h2 class="identify__result-title" style="margin-top:var(--space-xl);">Organic Treatment</h2>
        <div class="care-list">
          ${diagnosis.treatment
            .map((t) => `<div class="care-list__item"><span class="care-list__check" aria-hidden="true">✓</span><span>${t}</span></div>`)
            .join('')}
        </div>

        <div style="margin-top:var(--space-xl);display:flex;gap:var(--space-md);flex-wrap:wrap;">
          <a href="chatbot.html" class="btn btn--primary">Ask Your AI →</a>
          <button class="btn btn--secondary" id="rerun-disease" type="button">↺ Run again</button>
        </div>
      </div>`;
    this.els.results.classList.add('is-visible');
    this.els.results.scrollIntoView({ behavior: 'smooth', block: 'start' });

    document.getElementById('rerun-disease').addEventListener('click', () => this.renderDiseaseResults());
  },

  getFavorites() {
    try {
      return JSON.parse(localStorage.getItem(this.FAVORITES_KEY)) || [];
    } catch (e) {
      return [];
    }
  },

  toggleFav(id) {
    let favs = this.getFavorites();
    const btn = document.querySelector(`[data-fav="${id}"]`);
    if (!btn) return;

    const already = favs.includes(id);
    if (already) {
      favs = favs.filter((f) => f !== id);
    } else {
      favs.push(id);
    }
    localStorage.setItem(this.FAVORITES_KEY, JSON.stringify(favs));

    btn.classList.toggle('is-fav', !already);
    btn.innerHTML = `<span aria-hidden="true">${already ? '☆' : '★'}</span><span>${already ? 'Save to favorites' : 'Saved'}</span>`;
  }
};

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

document.addEventListener('DOMContentLoaded', () => Identify.init());