/**
 * GrowWise — Smart Plant Recommendation Quiz
 * Collects space/sunlight/experience/goal answers and scores every plant
 * in PlantDB to surface the best matches. Matches can be saved to the
 * user's garden in localStorage.
 */

'use strict';

const Recommend = {
  GARDEN_KEY: 'growwise.garden',

  questions: [
    {
      key: 'space',
      question: 'Where will your plants grow?',
      options: [
        { value: 'terrace', icon: '🏡', title: 'Terrace', desc: 'Open, spacious, all-day sun' },
        { value: 'balcony', icon: '🏢', title: 'Balcony', desc: 'Covered or semi-open railing' },
        { value: 'indoor', icon: '🏠', title: 'Indoor', desc: 'Windowsills, shelves & rooms' }
      ]
    },
    {
      key: 'sunlight',
      question: 'How much sunlight does your spot get?',
      options: [
        { value: 'full', icon: '☀️', title: 'Full sun', desc: '6+ hours of direct light' },
        { value: 'partial', icon: '🌤️', title: 'Partial sun', desc: '3–6 hours, dappled' },
        { value: 'low', icon: '🌥️', title: 'Low light', desc: 'Less than 3 hours, mostly shade' }
      ]
    },
    {
      key: 'experience',
      question: 'How experienced a gardener are you?',
      options: [
        { value: 'beginner', icon: '🌱', title: 'Beginner', desc: 'My first time growing' },
        { value: 'intermediate', icon: '🌿', title: 'Intermediate', desc: 'I\'ve grown a few things' },
        { value: 'advanced', icon: '🌳', title: 'Advanced', desc: 'I\'m a confident grower' }
      ]
    },
    {
      key: 'goal',
      question: 'What do you want to grow most?',
      options: [
        { value: 'vegetables', icon: '🥬', title: 'Vegetables', desc: 'Tomatoes, greens & more' },
        { value: 'herbs', icon: '🌿', title: 'Herbs', desc: 'Kitchen herbs & aromatics' },
        { value: 'flowers', icon: '🌸', title: 'Flowers', desc: 'Blooms & ornamentals' },
        { value: 'medicinal', icon: '💊', title: 'Medicinal', desc: 'Traditional remedy plants' },
        { value: 'fruits', icon: '🍅', title: 'Fruits', desc: 'Berries & small fruit' }
      ]
    }
  ],

  answers: {},
  current: 0,
  els: {},

  init() {
    this.els.steps = document.getElementById('quiz-steps');
    this.els.result = document.getElementById('quiz-result');
    this.els.fill = document.getElementById('progress-fill');
    this.els.progressText = document.getElementById('progress-text');
    this.els.back = document.getElementById('quiz-back');
    this.els.next = document.getElementById('quiz-next');

    this.renderSteps();
    this.bindActions();
    this.showStep(0);
  },

  renderSteps() {
    this.els.steps.innerHTML = this.questions
      .map(
        (q, qi) => `
          <div class="quiz__step" data-step="${qi}">
            <span class="quiz__label">Question ${qi + 1} of ${this.questions.length}</span>
            <h2 class="quiz__question">${q.question}</h2>
            <div class="quiz__options">
              ${q.options
                .map(
                  (o) => `
                    <label class="quiz__option">
                      <input type="radio" name="q-${q.key}" value="${o.value}">
                      <div class="quiz__option-body">
                        <div class="quiz__option-icon" aria-hidden="true">${o.icon}</div>
                        <div>
                          <div class="quiz__option-title">${o.title}</div>
                          <div class="quiz__option-desc">${o.desc}</div>
                        </div>
                      </div>
                    </label>`
                )
                .join('')}
            </div>
          </div>`
      )
      .join('');
  },

  bindActions() {
    this.els.next.addEventListener('click', () => {
      const q = this.questions[this.current];
      const selected = this.els.steps.querySelector(`input[name="q-${q.key}"]:checked`);
      if (!selected) {
        this.els.next.textContent = 'Pick an option first →';
        window.setTimeout(() => (this.els.next.textContent = 'Continue →'), 1200);
        return;
      }

      this.answers[q.key] = selected.value;

      if (this.current < this.questions.length - 1) {
        this.showStep(this.current + 1);
      } else {
        this.showResult();
      }
    });

    this.els.back.addEventListener('click', () => {
      if (this.els.result.classList.contains('is-active')) {
        this.showStep(this.questions.length - 1);
      } else if (this.current > 0) {
        this.showStep(this.current - 1);
      }
    });

    this.els.result.addEventListener('click', (e) => {
      const add = e.target.closest('[data-add]');
      if (add) {
        this.addToGarden(add.dataset.add);
        add.classList.add('is-fav');
        add.textContent = '✓ Added to garden';
      }
    });
  },

  showStep(index) {
    this.current = index;
    this.els.steps.querySelectorAll('.quiz__step').forEach((s, i) =>
      s.classList.toggle('is-active', i === index)
    );

    this.els.result.classList.remove('is-active');
    this.els.next.style.visibility = '';
    this.els.back.style.visibility = index === 0 ? 'hidden' : '';

    const pct = Math.round(((index + 1) / this.questions.length) * 100);
    this.els.fill.style.width = pct + '%';
    this.els.progressText.textContent = `${index + 1} / ${this.questions.length}`;
    this.els.next.textContent = index === this.questions.length - 1 ? 'Show My Plants ✨' : 'Continue →';
  },

  scorePlant(plant) {
    let score = 0;

    const expRank = { beginner: 0, intermediate: 1, advanced: 2 };
    const diffRank = { 'Very Easy': 0, Easy: 1, Intermediate: 2 };
    const experience = expRank[this.answers.experience];
    const difficulty = diffRank[plant.difficulty] ?? 2;

    score += 3 - Math.abs(experience - difficulty);

    if (this.answers.sunlight === 'low') {
      score += plant.sunlight.toLowerCase().includes('low') ? 2 : -1;
    } else if (this.answers.sunlight === 'partial') {
      score += plant.sunlight.toLowerCase().includes('partial') ? 2 : 0;
    } else {
      score += plant.sunlight.toLowerCase().includes('full sun') ? 2 : 0;
    }

    const spaceBest = plant.bestFor.join(' ').toLowerCase();
    const spaceKeys = {
      terrace: 'terrace',
      balcony: 'balcony',
      indoor: 'indoor'
    };
    if (spaceBest.includes(spaceKeys[this.answers.space])) {
      score += 2;
    }

    if (plant.category === this.answers.goal) {
      score += 3;
    } else if (this.answers.goal === 'fruits' && plant.category === 'vegetables') {
      score += 1;
    }

    return score;
  },

  showResult() {
    const scored = PLANTS.map((p) => ({ plant: p, score: this.scorePlant(p) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);

    const maxScore = Math.max(...scored.map((s) => s.score), 1);

    this.els.steps.querySelectorAll('.quiz__step').forEach((s) => s.classList.remove('is-active'));
    this.els.result.classList.add('is-active');
    this.els.next.style.visibility = 'hidden';
    this.els.back.style.visibility = '';
    this.els.fill.style.width = '100%';
    this.els.progressText.textContent = 'Done!';

    this.els.result.innerHTML = `
      <div class="quiz__result-header">
        <div class="quiz__result-emoji" aria-hidden="true">🌿</div>
        <span class="section__label">Your Personalized Picks</span>
        <h2 class="quiz__question" style="margin-bottom:0;">Best Plants for Your Space</h2>
      </div>
      ${scored
        .map(
          (s) => `
            <a class="quiz__match" href="plant-detail.html?id=${s.plant.id}" style="text-decoration:none;color:inherit;">
              <div class="quiz__match-left">
                <div class="quiz__match-thumb" style="background:${s.plant.gradient}" aria-hidden="true">${s.plant.emoji}</div>
                <div>
                  <div class="quiz__match-name">${s.plant.name}</div>
                  <div class="quiz__match-sub">${s.plant.category} · ${s.plant.difficulty}</div>
                </div>
              </div>
              <div class="quiz__match-score">${Math.round((s.score / maxScore) * 100)}%</div>
            </a>`
        )
        .join('')}
      <div style="display:flex;gap:var(--space-md);justify-content:center;flex-wrap:wrap;margin-top:var(--space-xl);">
        <button class="btn btn--primary" data-add="${scored[0].plant.id}" type="button" style="text-decoration:none;">➕ Add top pick to garden</button>
        <a href="encyclopedia.html" class="btn btn--secondary">Browse all plants →</a>
      </div>`;
    this.els.result.scrollIntoView({ behavior: 'smooth', block: 'start' });
  },

  addToGarden(id) {
    let garden = [];
    try {
      garden = JSON.parse(localStorage.getItem(this.GARDEN_KEY)) || [];
    } catch (e) {
      garden = [];
    }
    if (!garden.includes(id)) {
      garden.push(id);
      localStorage.setItem(this.GARDEN_KEY, JSON.stringify(garden));
    }
  }
};

document.addEventListener('DOMContentLoaded', () => Recommend.init());