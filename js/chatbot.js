/**
 * GrowWise — AI Gardening Chatbot
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
  typing: false,

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

    this.renderSuggestions();
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    this.field.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.form.requestSubmit();
      }
      this.autoGrow();
    });
    this.field.addEventListener('input', () => this.autoGrow());
    this.messagesEl.addEventListener('click', (e) => {
      const btn = e.target.closest('.chat-suggestion');
      if (btn) this.ask(btn.dataset.sq);
    });
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

  handleSubmit(e) {
    e.preventDefault();
    const text = this.field.value.trim();
    if (!text || this.fieldDisabled) return;
    this.ask(text);
  },

  ask(text) {
    this.addUserMessage(text);
    this.field.value = '';
    this.autoGrow();
    this.disableInput(true);
    this.addTyping();

    const reply = this.getReply(text);

    window.setTimeout(() => {
      this.removeTyping();
      this.addAiMessage(reply);
      this.disableInput(false);
      this.scrollToBottom();
    }, 900 + Math.random() * 900);
  },

  disableInput(disabled) {
    this.fieldDisabled = disabled;
    this.field.disabled = disabled;
    this.sendBtn.disabled = disabled;
  },

  addUserMessage(text) {
    this.removeWelcome();
    const node = document.createElement('div');
    node.className = 'chat-msg chat-msg--user';
    node.innerHTML = `
      <div class="chat-msg__avatar" aria-hidden="true">🧑</div>
      <div class="chat-msg__bubble">${this.escape(text)}</div>`;
    this.messagesEl.appendChild(node);
    this.scrollToBottom();
  },

  addAiMessage(text) {
    const node = document.createElement('div');
    node.className = 'chat-msg chat-msg--ai';
    node.innerHTML = `
      <div class="chat-msg__avatar" aria-hidden="true">🌿</div>
      <div class="chat-msg__bubble"></div>`;
    this.messagesEl.appendChild(node);
    const bubble = node.querySelector('.chat-msg__bubble');
    if (text.indexOf('<') !== -1) {
      bubble.innerHTML = text;
      this.scrollToBottom();
    } else {
      this.typeText(bubble, text);
      this.scrollToBottom();
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

  typeText(el, text) {
    let i = 0;
    const speed = 14;
    el.textContent = '';
    const timer = window.setInterval(() => {
      i++;
      el.textContent = text.slice(0, i);
      this.scrollToBottom();
      if (i >= text.length) window.clearInterval(timer);
    }, speed);
  },

  scrollToBottom() {
    this.body.scrollTop = this.body.scrollHeight;
  },

  escape(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  getReply(text) {
    const q = text.toLowerCase();

    const plantMatch = PlantDB.all().find(
      (p) => q.includes(p.name.toLowerCase().split(' ')[0]) || q.includes(p.name.toLowerCase())
    );

    if (plantMatch) return this.buildPlantReply(plantMatch);

    if (/(watering|how often to water|water |watered)/.test(q) && /(tomato|pepper|chilli|eggplant|brinjal)/.test(q)) {
      return '🌱 Great question! Fruiting vegetables like tomatoes and chillies like consistent moisture. 💧 Water deeply every 2–3 days, keeping soil moist about 1 inch deep — never let it dry out or sit soggy. Mulching around the base helps lock in moisture. Water early morning to reduce disease.';
    }

    if (/(yellow|yellowing|leaves turning|drooping|wilting)/.test(q)) {
      return '🟡 Yellow or wilting leaves usually mean one of three things: 1) Overwatering/root rot, 2) Nitrogen deficiency, or 3) Too little light. Check the root ball — if the soil smells musty and is soggy, let it dry out and improve drainage. If soil is dry and leaves are pale, water more and add a balanced organic fertilizer. Share a photo with my disease-detector for a precise diagnosis!';
    }

    if (/(fertilizer|fertiliser|feed|manure|compost)/.test(q)) {
      return '🧪 For organic gardening I recommend a rotation: compost or vermicompost as a base, fresh cow-dung tea (1:10 with water) every 2 weeks for leafy growth, and a high-potash feed (say, banana-peel-soaked water) once flowers/fruit appear. Too much nitrogen gives bushy leaves but fewer fruit — go easy!';
    }

    if (/(pest|aphid|bugs|insects|mites|whitefly|worm)/.test(q)) {
      return '🐛 The best organic first defence is a neem-oil spray (5 ml neem oil + few drops of soap in 1 litre water) applied weekly in the cool evening. Knock off aphids with a strong water blast first. Encourage ladybirds by planting marigolds nearby — they love to munch on pests!';
    }

    if (/(low light|shade|indoor|no sun|dark)/.test(q)) {
      return '🏠 Great low-light choices: Snake Plant, Pothos (Money Plant), Peace Lily, and Boston Fern. They thrive in bright indirect light with only 4–6 hours. Water Snake Plant and Pothos only when soil is dry; Peace Lily and Fern like more moisture. Ask me about any one of them for full care!';
    }

    if (/(seed|sow|planting|when to)/.test(q)) {
      return '📅 Most easy-to-grow starts: winter greens (spinach, coriander, lettuce) from October–January; summer crops (tomato, brinjal, chilli, marigold) from February–May; monsoon greens from July. Always harden young transplants before moving outdoors. Check the Seasonal Calendar in your dashboard for month-wise guidance!';
    }

    if (/(disease|blight|fungus|rot|mildew|spot)/.test(q)) {
      return '🔬 Isolate the affected plant first to stop spread. Remove and discard badly diseased leaves, improve air circulation, keep the soil dry-ish at the top, and apply a weekly neem or biotic milk spray (1 part milk to 9 parts water) against mildew. For blight on tomatoes, drip water the base (never the leaves) and prune lower foliage.';
    }

    if (/(soil|potting|repot|repotting|drainage)/.test(q)) {
      return '🪴 Use a well-draining mix: 2 parts good quality potting soil + 1 part perlite/brick chips + a handful of compost. Choose pots with drainage holes and add a one-inch layer of pebbles. Most houseplants dislike sitting in a saucer of water — repot every 1–2 years into a slightly bigger pot.';
    }

    if (/(hello|hi|hey|thanks|thank you|ty)/.test(q)) {
      return '👋 Hello! I\'m your AI Gardener. Ask me about watering, sunlight, organic fertilizer, pests, diseases, or seasonal planting. You can also name any plant (like "mint" or "tomato") and I\'ll share its full care guide.';
    }

    return '🌿 Great question! As my AI, I can help with: watering and sunlight needs, organic fertilizers and compost, pests and disease control, low-light/indoor plants, and seasonal planting. Try asking e.g. "How should I care for basil?" or "Sunlight needed for strawberry?" and I\'ll guide you step by step.';
  },

  buildPlantReply(plant) {
    return `${plant.emoji} <strong>${plant.name}</strong> (<em>${plant.scientific}</em>) — ${plant.category}.\n\n☀️ <strong>Sunlight:</strong> ${plant.sunlight}\n💧 <strong>Watering:</strong> ${plant.water}\n🌍 <strong>Soil:</strong> ${plant.soil}\n🧪 <strong>Fertilizer:</strong> ${plant.fertilizer}\n📅 <strong>Best season:</strong> ${plant.season}\n✂️ <strong>Harvest:</strong> ${plant.harvest}\n\n🐛 Keep an eye on: ${plant.pests}. ${plant.description} See the full care guide in our <a href="plant-detail.html?id=${plant.id}" class="dash-panel__action">Encyclopedia →</a>`;
  }
};

document.addEventListener('DOMContentLoaded', () => Chatbot.init());