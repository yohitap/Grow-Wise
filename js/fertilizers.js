/**
 * GrowWise — Homemade Fertilizer Library
 * Organic, kitchen-scrap and DIY fertilizer recipes with method + usage.
 * Shared source of truth; structured for a future DB-backed version.
 */

'use strict';

const FERTILIZERS = [
  {
    id: 'banana-peel',
    name: 'Banana Peel Water',
    emoji: '🍌',
    category: 'Kitchen',
    difficulty: 'Very Easy',
    frequency: 'Every 2 weeks',
    bestFor: ['Fruiting', 'Flowering plants', 'Tomatoes', 'Chillies'],
    gradient: 'linear-gradient(135deg, #F4D35E, #E8A838)',
    description: 'A potassium-rich soak that powers fruit and flower formation — the simplest all-purpose bloom booster.',
    ingredients: ['2–3 banana peels', '1 litre water', 'Airtight jar (optional)'],
    method: [
      'Soak chopped banana peels in water for 2–3 days in a covered jar.',
      'Strain the liquid into a watering can.',
      'Dilute with an equal part of fresh water before applying.'
    ],
    howToUse: 'Water around the base of fruiting and flowering plants every 2 weeks. Bury the leftover peels in the soil as slow-release potassium.',
    tip: 'Always dilute — undiluted peel water can be too strong for seedlings.'
  },
  {
    id: 'eggshell',
    name: 'Eggshell Calcium',
    emoji: '🥚',
    category: 'Kitchen',
    difficulty: 'Very Easy',
    frequency: 'Monthly',
    bestFor: ['Tomatoes', 'Peppers', 'All potted plants'],
    gradient: 'linear-gradient(135deg, #EDE6D9, #D8CFC0)',
    description: 'Crushed shells release calcium slowly, preventing blossom-end rot and strengthening cell walls.',
    ingredients: ['6–8 eggshells', 'Baking tray'],
    method: [
      'Rinse shells and dry them in the sun or an oven at low heat.',
      'Crush into a coarse powder (fine enough to mix into soil).',
      'Sprinkle a teaspoon into each planting hole or over the pot surface.'
    ],
    howToUse: 'Mix into the top 2 inches of soil once a month. For a fast boost, steep crushed shells in water overnight and use the liquid.',
    tip: 'Crushed shells also help deter snails and slugs at the soil line.'
  },
  {
    id: 'onion-peel',
    name: 'Onion Peel Tea',
    emoji: '🧅',
    category: 'Kitchen',
    difficulty: 'Very Easy',
    frequency: 'Weekly',
    bestFor: ['Leafy greens', 'Herbs', 'All plants'],
    gradient: 'linear-gradient(135deg, #E3A587, #C97B5D)',
    description: 'Packed with micro-nutrients and gentle antifungal compounds — a mild tonic that strengthens plants against disease.',
    ingredients: ['A handful of onion skins', '1 litre boiling water'],
    method: [
      'Steep onion skins in boiling water for 24 hours.',
      'Strain the amber liquid into a spray bottle or can.',
      'Use as a soil drench or light foliar spray.'
    ],
    howToUse: 'Drench the soil weekly for healthy leaves. As a foliar spray it adds a mild layer of protection against fungal spores.',
    tip: 'The tea is gentle enough for seedlings — unlike stronger feeds.'
  },
  {
    id: 'rice-water',
    name: 'Rice Water',
    emoji: '🍚',
    category: 'Kitchen',
    difficulty: 'Very Easy',
    frequency: 'Every 1–2 weeks',
    bestFor: ['Indoor plants', 'Seedlings', 'All plants'],
    gradient: 'linear-gradient(135deg, #F2EDE4, #DCD3C3)',
    description: 'The cloudy water from rinsing rice carries starches and B-vitamins that feed soil microbes and leafy growth.',
    ingredients: ['1 cup uncooked rice', '4 cups water'],
    method: [
      'Rinse rice in water as usual.',
      'Collect the cloudy rinse water.',
      'Let it sit at room temperature for 24 hours before use.'
    ],
    howToUse: 'Use it to water houseplants and seedlings once a week. Best used fresh — fermented rice water can smell and grow mould.',
    tip: 'Room-temperature fermented rice water boosts beneficial bacteria, but skip it if the smell bothers you.'
  },
  {
    id: 'compost-tea',
    name: 'Compost Tea',
    emoji: '☕',
    category: 'Liquid',
    difficulty: 'Moderate',
    frequency: 'Every 2–3 weeks',
    bestFor: ['Everything', 'Heavy feeders', 'Soil health'],
    gradient: 'linear-gradient(135deg, #6B4F2A, #8B6B3F)',
    description: 'A microbe-rich liquid that supercharges soil life — the closest thing to an all-in-one organic fertilizer.',
    ingredients: ['1 part mature compost', '4–5 parts water', 'Aerator or daily stirring', 'Old sock or cloth bag'],
    method: [
      'Put compost in a cloth bag and suspend it in a bucket of water.',
      'Stir every day (or aerate with a pump) for 3–5 days.',
      'Strain and dilute 1:1 with water before using.'
    ],
    howToUse: 'Drench the soil every 2–3 weeks. Use the leftover compost as mulch. Apply on overcast days to avoid scorching leaves.',
    tip: 'Use within 24 hours — the beneficial microbes die off and the tea can sour.'
  },
  {
    id: 'vermicompost',
    name: 'Vermicompost',
    emoji: '🪱',
    category: 'Manure',
    difficulty: 'Easy',
    frequency: 'Every 4–6 weeks',
    bestFor: ['All plants', 'Potted soil', 'Raised beds'],
    gradient: 'linear-gradient(135deg, #3A2414, #5A3A22)',
    description: 'Worm castings are the gold standard of organic soil amendment — rich, balanced and impossible to overdo.',
    ingredients: ['Worm bin castings', 'Kitchen scraps', 'Shredded paper'],
    method: [
      'Feed kitchen scraps to worms in a ventilated bin.',
      'Harvest castings every 2–3 months.',
      'Air-dry slightly before storage.'
    ],
    howToUse: 'Mix a handful into the topsoil monthly, or brew 1 part castings with 4 parts water for a gentle tea. Safe for every growth stage.',
    tip: 'Castings improve drainage and water retention at the same time — a true soil builder.'
  },
  {
    id: 'cow-dung-tea',
    name: 'Cow Dung Tea',
    emoji: '🐄',
    category: 'Manure',
    difficulty: 'Moderate',
    frequency: 'Every 2 weeks',
    bestFor: ['Leafy vegetables', 'Fast growers'],
    gradient: 'linear-gradient(135deg, #8A6B3F, #B08D57)',
    description: 'A classic nitrogen-rich foliar and soil feed that pushes strong, deep-green leafy growth.',
    ingredients: ['A fistful of dried cow dung', '10 litres water', 'Bucket'],
    method: [
      'Soak dried cow dung in water overnight.',
      'Stir well and strain the liquid.',
      'Dilute 1 part tea with 2 parts water.'
    ],
    howToUse: 'Water leafy greens and fast growers every 2 weeks. Use fully dried, aged dung — fresh dung burns roots.',
    tip: 'Add a tablespoon of jaggery to ferment it slightly and boost beneficial microbes.'
  },
  {
    id: 'neem-cake',
    name: 'Neem Cake Powder',
    emoji: '🍃',
    category: 'Manure',
    difficulty: 'Easy',
    frequency: 'Every 4–6 weeks',
    bestFor: ['Pest-prone plants', 'Vegetables', 'Soil life'],
    gradient: 'linear-gradient(135deg, #2D6A4F, #52B788)',
    description: 'The pressed residue of neem seeds — feeds plants slowly while suppressing soil pests and root nematodes.',
    ingredients: ['Neem cake powder', 'Water'],
    method: [
      'Mix 2 tablespoons of neem cake into the top 2 inches of soil.',
      'Water in well so the nutrients release slowly.',
      'Alternatively steep overnight and use the water as a drench.'
    ],
    howToUse: 'Apply monthly around vegetables and pest-prone plants. It feeds, conditions soil, and deters soil-dwelling pests in one step.',
    tip: 'It has a distinct smell for a day or two — it fades quickly after watering.'
  },
  {
    id: 'epsom-salt',
    name: 'Epsom Salt Solution',
    emoji: '🧂',
    category: 'Booster',
    difficulty: 'Very Easy',
    frequency: 'Monthly',
    bestFor: ['Peppers', 'Tomatoes', 'Magnesium-hungry plants'],
    gradient: 'linear-gradient(135deg, #A8C8E0, #7FA8C8)',
    description: 'Magnesium sulphate unlocks chlorophyll production — a targeted cure for yellowing leaves between veins.',
    ingredients: ['1 tablespoon Epsom salt', '1 litre water'],
    method: [
      'Dissolve Epsom salt fully in lukewarm water.',
      'Spray onto leaves or drench the soil.',
      'Apply in the evening to avoid leaf burn.'
    ],
    howToUse: 'Use monthly during the growing season, especially for peppers and tomatoes. Great as a foliar spray when leaves yellow between veins.',
    tip: 'Do not overuse — magnesium excess can block calcium uptake.'
  },
  {
    id: 'wood-ash',
    name: 'Wood Ash',
    emoji: '🔥',
    category: 'Kitchen',
    difficulty: 'Easy',
    frequency: 'Occasional',
    bestFor: ['Fruiting plants', 'Acidic soil'],
    gradient: 'linear-gradient(135deg, #6E6E6E, #9A9A9A)',
    description: 'Ash from clean, untreated wood delivers potassium and calcium while gently raising soil pH.',
    ingredients: ['Clean wood ash', 'Sieve'],
    method: [
      'Collect ash only from untreated, chemical-free wood.',
      'Sieve out large chunks and charcoal.',
      'Dust a thin layer over the soil surface.'
    ],
    howToUse: 'Lightly dust fruiting plants once a month. It helps alkaline-loving plants (like lavender) but avoid on acid lovers such as blueberries.',
    tip: 'A thin dusting goes a long way — too much ash makes soil overly alkaline.'
  },
  {
    id: 'curd-water',
    name: 'Curd & Molasses Water',
    emoji: '🥛',
    category: 'Booster',
    difficulty: 'Easy',
    frequency: 'Every 2–3 weeks',
    bestFor: ['Flowering', 'Fruiting', 'Soil microbes'],
    gradient: 'linear-gradient(135deg, #DCE4EA, #B8C6D0)',
    description: 'Beneficial lactobacillus bacteria and sugar feed soil life, creating a fertile environment for blooming.',
    ingredients: ['2 tablespoons curd/yogurt', '1 teaspoon molasses or jaggery', '1 litre water'],
    method: [
      'Stir curd and molasses into water until fully mixed.',
      'Let it sit for 1 hour at room temperature.',
      'Apply to the soil, not the leaves.'
    ],
    howToUse: 'Water flowering and fruiting plants every 2–3 weeks. The microbes colonise the soil and improve nutrient availability.',
    tip: 'Use plain, unsweetened curd. Skip if your plants show any sign of fungus.'
  },
  {
    id: 'grass-clipping',
    name: 'Grass Clipping Mulch Tea',
    emoji: '🌱',
    category: 'Kitchen',
    difficulty: 'Easy',
    frequency: 'Every 3 weeks',
    bestFor: ['Nitrogen lovers', 'Leafy greens'],
    gradient: 'linear-gradient(135deg, #52B788, #95D5B2)',
    description: 'Fresh grass clippings release nitrogen fast — both as a mulch and as a steamy liquid feed for hungry leaves.',
    ingredients: ['Fresh grass clippings', 'Water'],
    method: [
      'Fill a bucket one-third with fresh clippings.',
      'Top up with water and steep for 2–3 days, stirring daily.',
      'Strain; dilute the dark liquid 1:2 with water.'
    ],
    howToUse: 'Drench leafy greens and heavy nitrogen feeders every 3 weeks. Use the leftover clippings as mulch to suppress weeds.',
    tip: 'Only use clippings from lawns that haven\'t been sprayed with herbicide.'
  }
];

const FERTILIZER_CATEGORIES = [
  { id: 'all', label: 'All Recipes', icon: '🧪' },
  { id: 'kitchen', label: 'Kitchen Scraps', icon: '🥣' },
  { id: 'liquid', label: 'Liquid Feeds', icon: '💧' },
  { id: 'manure', label: 'Manures', icon: '🐄' },
  { id: 'booster', label: 'Boosters', icon: '⚡' }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { FERTILIZERS, FERTILIZER_CATEGORIES };
}
