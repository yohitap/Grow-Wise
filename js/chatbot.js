/**
 * GrowWise — Your AI Gardening Chatbot
 * Front-end chat assistant with intelligent, rule-based responses.
 * Uses the shared PlantDB so it can answer questions about encyclopedia plants.
 * Designed to be swapped to the OpenAI API in a future build.
 */

'use strict';

const Chatbot = {
  messagesEl: null,
  form: null,
  field: null,
  body: null,
  sendBtn: null,
  counterEl: null,
  charLimit: 500,
  typing: false,
  fieldDisabled: false,

  suggestions: [
    'How often should I water my tomatoes?',
    'My mint leaves are turning yellow — why?',
    'Best organic fertilizer for flowering?',
    'How do I deal with aphids?',
    'What can I grow in low light?'
  ],

  init() {
    this.messagesEl = document.getElementById('chat-messages');
    this.form = document.getElementById('chat-form');
    this.field = document.getElementById('chat-field');
    this.body = document.getElementById('chat-body');
    this.sendBtn = document.getElementById('chat-send');
    this.counterEl = document.getElementById('chat-counter');

    this.renderSuggestions();
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    this.field.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.form.requestSubmit();
      }
    });
    this.field.addEventListener('input', () => {
      this.autoGrow();
      this.updateInputState();
    });
    this.messagesEl.addEventListener('click', (e) => {
      const chip = e.target.closest('.chat-chip');
      if (chip) { this.ask(chip.textContent.trim()); return; }
      const btn = e.target.closest('.chat-suggestion');
      if (btn) { this.ask(btn.dataset.sq); return; }
      const copy = e.target.closest('.chat-msg__copy');
      if (copy) this.copyText(copy);
    });
    this.updateInputState();
  },

  renderSuggestions() {
    const wrap = document.getElementById('chat-suggestions');
    wrap.innerHTML = this.suggestions
      .map((s) => `<button class="chat-suggestion" data-sq="${s}" type="button">${s}</button>`)
      .join('');
  },

  autoGrow() {
    this.field.style.height = 'auto';
    this.field.style.height = Math.min(this.field.scrollHeight, 120) + 'px';
  },

  updateInputState() {
    const len = this.field.value.length;
    const hasText = this.field.value.trim().length > 0;
    this.sendBtn.disabled = this.fieldDisabled || !hasText || len > this.charLimit;
    this.sendBtn.classList.toggle('is-active', hasText && !this.fieldDisabled);
    if (this.counterEl) {
      this.counterEl.textContent = `${Math.min(len, this.charLimit)}/${this.charLimit}`;
      this.counterEl.classList.toggle('is-over', len > this.charLimit);
    }
  },

  handleSubmit(e) {
    e.preventDefault();
    const text = this.field.value.trim();
    if (!text || this.fieldDisabled) return;
    if (text.length > this.charLimit) {
      this.field.classList.remove('is-limit');
      void this.field.offsetWidth;
      this.field.classList.add('is-limit');
      return;
    }
    this.ask(text);
  },

  ask(text) {
    this.addUserMessage(text);
    this.field.value = '';
    this.autoGrow();
    this.updateInputState();
    this.disableInput(true);
    this.addTyping();

    const reply = this.getReply(text);

    window.setTimeout(() => {
      this.removeTyping();
      this.addAiMessage(reply);
      this.disableInput(false);
      this.scrollToBottom();
    }, 700 + Math.random() * 700);
  },

  disableInput(disabled) {
    this.fieldDisabled = disabled;
    this.field.disabled = disabled;
    this.updateInputState();
  },

  addUserMessage(text) {
    this.removeWelcome();
    const node = document.createElement('div');
    node.className = 'chat-msg chat-msg--user';
    node.innerHTML = `
      <div class="chat-msg__avatar" aria-hidden="true">🧑</div>
      <div class="chat-msg__content">
        <div class="chat-msg__bubble">${this.escape(text)}</div>
        <div class="chat-msg__actions">
          <span class="chat-msg__name">You</span>
          <span class="chat-msg__dot" aria-hidden="true">·</span>
          <span class="chat-msg__time">${this.nowTime()}</span>
        </div>
      </div>`;
    this.messagesEl.appendChild(node);
    this.scrollToBottom();
  },

  addAiMessage(reply) {
    const html = reply.html || this.formatMessage(reply.text);
    const plain = reply.plain || (reply.html ? this.stripHtml(reply.html) : this.toPlain(reply.text));

    const node = document.createElement('div');
    node.className = 'chat-msg chat-msg--ai';
    node.innerHTML = `
      <div class="chat-msg__avatar" aria-hidden="true">🌿</div>
      <div class="chat-msg__content">
        <div class="chat-msg__bubble"></div>
        <div class="chat-msg__actions">
          <span class="chat-msg__name">Your AI</span>
          <span class="chat-msg__dot" aria-hidden="true">·</span>
          <span class="chat-msg__time">${this.nowTime()}</span>
          <button type="button" class="chat-msg__copy" aria-label="Copy answer">Copy</button>
        </div>
        <div class="chat-followup"></div>
      </div>`;
    this.messagesEl.appendChild(node);

    const bubble = node.querySelector('.chat-msg__bubble');
    const copyBtn = node.querySelector('.chat-msg__copy');
    copyBtn.dataset.copy = plain;
    const fuEl = node.querySelector('.chat-followup');

    const finish = () => {
      if (reply.followups && reply.followups.length) {
        fuEl.innerHTML = reply.followups
          .map((s) => `<button class="chat-chip" type="button">${this.escape(s)}</button>`)
          .join('');
      }
      this.scrollToBottom();
    };

    if (reply.html) {
      bubble.innerHTML = reply.html;
      finish();
    } else {
      this.typeText(bubble, plain, html, finish);
    }
  },

  addTyping() {
    const node = document.createElement('div');
    node.className = 'chat-typing';
    node.innerHTML = `<span></span><span></span><span></span>`;
    node.dataset.typing = 'true';
    this.messagesEl.appendChild(node);
    this.scrollToBottom();
  },

  removeTyping() {
    const t = this.messagesEl.querySelector('[data-typing]');
    if (t) t.remove();
  },

  removeWelcome() {
    const welcome = this.messagesEl.querySelector('.chat-welcome');
    if (welcome) welcome.remove();
  },

  typeText(el, plain, html, done) {
    let i = 0;
    el.textContent = '';
    const speed = plain.length > 260 ? 6 : 12;
    const timer = window.setInterval(() => {
      i++;
      el.textContent = plain.slice(0, i);
      this.scrollToBottom();
      if (i >= plain.length) {
        window.clearInterval(timer);
        if (html) el.innerHTML = html;
        this.scrollToBottom();
        if (done) done();
      }
    }, speed);
  },

  scrollToBottom() {
    this.body.scrollTop = this.body.scrollHeight;
  },

  nowTime() {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  },

  copyText(btn) {
    const text = btn.dataset.copy;
    if (!text) return;

    const done = () => {
      const original = btn.textContent;
      btn.textContent = 'Copied!';
      btn.classList.add('is-copied');
      window.setTimeout(() => {
        btn.textContent = original;
        btn.classList.remove('is-copied');
      }, 1400);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(() => this.fallbackCopy(text, done));
    } else {
      this.fallbackCopy(text, done);
    }
  },

  fallbackCopy(text, done) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (e) { /* noop */ }
    document.body.removeChild(ta);
    done();
  },

  escape(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  stripHtml(html) {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent;
  },

  toPlain(text) {
    return text.replace(/\*\*([^*]+)\*\*/g, '$1').replace(/\*([^*]+)\*/g, '$1');
  },

  inlineMarkup(line) {
    return line
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>');
  },

  formatMessage(text) {
    const lines = this.escape(text).trim().split('\n');
    let html = '';
    let listOpen = false;
    const closeList = () => {
      if (listOpen) { html += '</ul>'; listOpen = false; }
    };

    lines.forEach((rawLine) => {
      const line = rawLine.trim();
      if (/^[-•]\s+/.test(line)) {
        if (!listOpen) { html += '<ul class="chat-list">'; listOpen = true; }
        html += `<li>${this.inlineMarkup(line.replace(/^[-•]\s+/, ''))}</li>`;
      } else {
        closeList();
        if (line) html += `<p>${this.inlineMarkup(line)}</p>`;
      }
    });
    closeList();
    return html;
  },

  findPlant(q) {
    const genericTokens = new Set(['plant', 'plants', 'leaf', 'leaves', 'green']);
    return PlantDB.all().find((p) =>
      p.name
        .toLowerCase()
        .split(/[(),\s]+/)
        .filter(Boolean)
        .some((t) => t.length > 2 && !genericTokens.has(t) && q.includes(t))
    );
  },

  getReply(text) {
    const q = text.toLowerCase();

    const plantMatch = this.findPlant(q);
    if (plantMatch) {
      return {
        html: this.buildPlantReply(plantMatch),
        followups: [
          `Common problems with ${plantMatch.name}?`,
          `Best fertilizer for ${plantMatch.name}?`,
          `When to harvest ${plantMatch.name}?`
        ]
      };
    }

    if (/(hi|hii|hiii|hello|hey|good\s*(morning|afternoon|evening)|namaste)/.test(q)) {
      return {
        text: '👋 Hello! I\'m **Your AI**, your personal gardening assistant. Ask me about watering, sunlight, organic fertilizer, pests, diseases, pruning, or seasonal planting. You can also name any plant — like *mint* or *tomato* — and I\'ll share its complete care guide.\n\nHow can I help your garden grow today?',
        followups: [
          'What can you help me with?',
          'How often should I water my tomatoes?',
          'Easiest plants to start with'
        ]
      };
    }

    if (/(thank|thanks|thx|ty\b|great|awesome|perfect).*(help|info|answer|guide)|(thanks|thank you)\b/.test(q)) {
      return {
        text: '🌿 You\'re welcome! Happy gardening — and remember, I\'m always here if a leaf starts to droop or you spot an odd bug.',
        followups: [
          'How do I deal with aphids?',
          'Best organic fertilizer for flowering?',
          'What can I grow in low light?'
        ]
      };
    }

    if (/(water|watering|watered|moisture|how\s*often.*water)/.test(q)) {
      return {
        text: '💧 Watering is all about **consistency**, not quantity.\n\n- **Fruiting veg** (tomato, chilli, brinjal): deeply every 2–3 days, soil moist ~1 inch down.\n- **Leafy greens** (spinach, coriander): every 1–2 days — they bolt in dry heat.\n- **Succulents & herbs like rosemary/lavender**: every 2–3 weeks, let soil fully dry.\n\nAlways check the top inch of soil first: if it feels dry, water; if still damp, wait. Water at the **base** in the early morning to reduce disease.',
        followups: [
          'How do I know if I\'m overwatering?',
          'Best time of day to water?',
          'How often should I water my tomatoes?'
        ]
      };
    }

    if (/(yellow|yellowing|turning\s*yellow|drooping|wilting|brown\s*(spots|tips)|dying|unhappy)/.test(q)) {
      return {
        text: '🟡 Yellow or wilting leaves usually mean one of three things:\n\n1) **Overwatering / root rot** — soggy, musty soil.\n2) **Nitrogen deficiency** — pale, older leaves first.\n3) **Too little light** — yellowing with leggy growth.\n\nCheck the root ball. If soil smells musty, let it dry and improve drainage. If soil is dry and leaves are pale, water more and add a balanced organic feed. Share a photo with the Identify tool for a precise diagnosis!',
        followups: [
          'Could it be overwatering?',
          'How do I fix a nutrient deficiency?',
          'What causes brown tips on leaves?'
        ]
      };
    }

    if (/(disease|blight|fungus|fungal|rot|root rot|mildew|rust|spot|wilt)/.test(q)) {
      return {
        text: '🔬 Isolate the affected plant first to stop the spread.\n\n- Remove and **discard diseased leaves** (don\'t compost them).\n- Improve **air circulation** — don\'t overcrowd pots.\n- Keep the **topsoil drier** and water at the base, never on foliage.\n- For mildew: spray **1 part milk + 9 parts water** weekly.\n- For tomato blight: drip-water the base and prune lower foliage.',
        followups: [
          'How to treat powdery mildew?',
          'Tomato blight treatment?',
          'How do I improve air circulation in pots?'
        ]
      };
    }

    if (/(pest|aphid|bugs|insects|mites|whitefly|worm|slug|fly|caterpillar|scale|borer)/.test(q)) {
      return {
        text: '🐛 The best organic first defence:\n\n- **Neem oil spray**: 5 ml neem oil + a few drops of soap in 1 litre of water, applied weekly in the cool evening.\n- **Aphids**: blast them off with a strong jet of water first, then spray.\n- **Slugs**: scatter crushed eggshells or coffee grounds around the base.\n- Encourage **ladybirds** by planting marigolds nearby — they love eating pests!',
        followups: [
          'How to make neem oil spray?',
          'Natural pest-repelling plants?',
          'How do I get rid of aphids?'
        ]
      };
    }

    if (/(fertilizer|fertiliser|feed|feeding|manure|compost|nutrient|nitrogen|potassium|potash)/.test(q)) {
      return {
        text: '🧪 For organic gardening, rotate your feeds:\n\n- **Compost / vermicompost** as the base for everything.\n- **Cow-dung tea** (1:10 with water) every 2 weeks for leafy growth (nitrogen).\n- **Banana-peel soaking water** once flowers/fruit appear (potash).\n- **Bone meal or rock phosphate** at planting for strong roots.\n\nToo much nitrogen gives bushy leaves but **fewer fruit** — go easy once flowering starts!',
        followups: [
          'DIY compost tea recipe?',
          'Best fertilizer for flowering?',
          'Best fertilizer for tomatoes?'
        ]
      };
    }

    if (/(low light|shade|indoor|no sun|dark corner|artificial|window light)/.test(q)) {
      return {
        text: '🏠 Great low-light choices:\n\n- **Snake Plant** — thrives on neglect, bright or low light.\n- **Pothos (Money Plant)** — fast, forgiving trailing vine.\n- **Peace Lily** — dramatic drooper that bounces back.\n- **Boston Fern** — loves humidity and bright shade.\n\nThey only need **4–6 hours of bright indirect light**. Let Snake Plant and Pothos dry out between waterings; Peace Lily and Fern like more moisture.',
        followups: [
          'How do I water a money plant?',
          'Best indoor plants for beginners?',
          'What lights help indoor plants?'
        ]
      };
    }

    if (/(heat|hot|summer|temperature|heatwave|screen|frost|cold|winter|freeze|scorch)/.test(q)) {
      return {
        text: '🌡️ Temperature care:\n\n- **Heatwave**: move pots to morning-sun spots, raise humidity with a pebble tray, and water early morning/evening. Never water leaves at noon.\n- **Frost risk**: bring sensitive plants indoors, or cover with cloth overnight — water plants well before a cold night.\n- **Indoor comfort zone** for most houseplants: **18–27°C**. Sudden drafts cause leaf drop — keep them away from AC vents.',
        followups: [
          'How do I protect plants from heat?',
          'Frost protection tips?',
          'What temperature is best for indoor plants?'
        ]
      };
    }

    if (/(prun|trim|cut back|deadhead|pinch|shape|spruit|sucker)/.test(q)) {
      return {
        text: '✂️ Pruning keeps plants healthy and productive:\n\n- **Remove dead/yellow leaves** any time — they waste energy.\n- **Deadhead flowers** (rose, marigold, geranium) weekly to encourage repeat blooms.\n- **Pinch suckers** on tomatoes so energy goes to fruit.\n- **Prune herbs** from the top, just above a leaf pair, for bushy regrowth.\nUse clean, sharp scissors and cut at a **45° angle** just above a node.',
        followups: [
          'How do I prune my tomato plant?',
          'When should I prune my rose?',
          'How to make plants bushier?'
        ]
      };
    }

    if (/(harvest|picking|pick|collect|ripe|cut.*(leaf|stem|fruit)|when.*(plant|sow|seed))/.test(q)) {
      return {
        text: '⏰ Harvesting tips:\n\n- **Tomatoes**: pick when fully deep-red and slightly soft.\n- **Herbs**: harvest from the top in the morning for the strongest flavour.\n- **Leafy greens**: cut outer leaves only, so the centre keeps growing.\n- **Peppers**: green = mild, red = hot; picking regularly keeps plants productive.\n\nAim to harvest in the **cool morning** when plants are fully hydrated — produce stays crisp longer.',
        followups: [
          'How do I know fruit is ripe?',
          'When to harvest herbs?',
          'Why is my plant not fruiting?'
        ]
      };
    }

    if (/(soil|potting|repot|repotting|drainage|mix|clay|compost.*soil)/.test(q)) {
      return {
        text: '🪴 Use a well-draining mix:\n\n- **2 parts** good potting soil\n- **1 part** perlite or brick chips\n- **A handful** of compost\n\nAlways choose pots with **drainage holes** and add a 1-inch pebble/crocks layer. Most houseplants dislike sitting in a saucer of water. Repot every **1–2 years** into a pot only 1–2 inches bigger — a huge pot causes soggy roots.',
        followups: [
          'How do I improve drainage?',
          'Best potting mix recipe?',
          'When should I repot my plant?'
        ]
      };
    }

    if (/(seed|sow|germinate|planting|when to (plant|start|grow)|season)/.test(q)) {
      return {
        text: '📅 Simple planting calendar:\n\n- **Winter greens** (spinach, coriander, lettuce): sow **Oct–Jan**.\n- **Summer crops** (tomato, brinjal, chilli, marigold): sow **Feb–May**.\n- **Monsoon greens**: sow through July.\n\nAlways **harden off** young transplants (a few hours outside each day for a week) before moving them out for good. Check the Seasonal Calendar page for month-wise guidance!',
        followups: [
          'When to plant tomatoes?',
          'How to start seeds indoors?',
          'Which months to sow coriander?'
        ]
      };
    }

    if (/(companion|grow together|neighbour|what to plant (with|near)|trap crop)/.test(q)) {
      return {
        text: '🌾 Companion planting:\n\n- **Tomato + basil + marigold** — basil boosts flavour, marigold repels nematodes.\n- **Carrot + onion** — onion masks the carrot-fly scent.\n- **Cabbage family + herbs** (dill, sage) — confuses cabbage moths.\n- Avoid putting **tomatoes with potatoes** (shared blight) or **fennel with most crops** (it inhibits growth).',
        followups: [
          'Good companions for tomatoes?',
          'What should not be planted together?',
          'Best plants to deter pests?'
        ]
      };
    }

    if (/(beginner|easy|start|new to|just started|first (plant|garden)|simple|balcony garden)/.test(q)) {
      return {
        text: '🌱 Perfect starter plants:\n\n- **Mint & Money Plant** — nearly impossible to kill.\n- **Tulsi & Basil** — rewarding kitchen herbs.\n- **Snake Plant & Aloe Vera** — thrive on neglect.\n- **Coriander & Spinach** — fast harvests to build confidence.\n\nStart small (2–3 pots), water only when the top inch is dry, and give everything **at least 4 hours of light**. Bit by bit, you\'ll find your rhythm!',
        followups: [
          'How do I set up a balcony garden?',
          'What tools do I need to start?',
          'Best first vegetable to grow?'
        ]
      };
    }

    if (/(what can you|help me|how (do|does) (you|your)|what should i ask|categories|topics)/.test(q)) {
      return {
        text: '🤖 I\'m **Your AI** and I can help with:\n\n- **Watering & sunlight** needs\n- **Organic fertilizers / compost** recipes\n- **Pests, diseases & treatments**\n- **Low-light & indoor plants**\n- **Planting seasons & harvesting**\n- Full **care guides for any plant** in our Encyclopedia\n\nJust ask, e.g. *"How should I care for basil?"* or *"Sunlight needed for strawberry?"*',
        followups: [
          'How often should I water my tomatoes?',
          'Best organic fertilizer for flowering?',
          'How do I deal with aphids?'
        ]
      };
    }

    return {
      text: '🌿 Great question! I\'m **Your AI**, and I can help with watering, sunlight, organic fertilizer, pests and disease control, low-light indoor plants, pruning, and seasonal planting.\n\nIf you name a plant from our Encyclopedia (like *mint* or *tomato*) I\'ll share its full care guide. Try asking "How should I care for basil?" or "Best fertilizer for flowering plants?"',
      followups: this.suggestions.slice(0, 3)
    };
  },

  buildPlantReply(plant) {
    return `${plant.emoji} <strong>${plant.name}</strong> (<em>${plant.scientific}</em>) — ${plant.category}.\n\n☀️ <strong>Sunlight:</strong> ${plant.sunlight}\n💧 <strong>Watering:</strong> ${plant.water}\n🌍 <strong>Soil:</strong> ${plant.soil}\n🧪 <strong>Fertilizer:</strong> ${plant.fertilizer}\n📅 <strong>Best season:</strong> ${plant.season}\n✂️ <strong>Harvest:</strong> ${plant.harvest}\n\n🐛 Keep an eye on: ${plant.pests}.\n${plant.description} See the full care guide in our <a href="plant-detail.html?id=${plant.id}" class="chat-link">Encyclopedia →</a>`;
  }
};

document.addEventListener('DOMContentLoaded', () => Chatbot.init());