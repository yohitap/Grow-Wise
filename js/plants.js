/**
 * GrowWise — Shared Plant Database
 * Single source of truth for plant profiles used by the Encyclopedia,
 * Plant Detail pages, Dashboard, and AI Chatbot.
 * Structured to be replaced later by a MongoDB-backed API.
 */

'use strict';

const PLANTS = [
  {
    id: 'tomato',
    name: 'Tomato',
    scientific: 'Solanum lycopersicum',
    category: 'vegetables',
    emoji: '🍅',
    difficulty: 'Intermediate',
    growthTime: '60–80 days',
    sunlight: '6–8 hours full sun',
    water: 'Every 2–3 days, keep soil moist',
    soil: 'Loamy, well-draining, pH 6.0–6.8',
    fertilizer: 'Compost tea or tomato feed every 2 weeks',
    season: 'Spring – Early Summer',
    harvest: 'Pick when deep red and slightly soft',
    pests: 'Aphids, hornworms, blight',
    description: 'The balcony gardener\'s favorite. Stakes or cages help heavy fruit trusses stay upright in pots and grow-bags.',
    care: [
      'Sow seeds 6–8 weeks before the last frost, or buy young transplants.',
      'Plant deep — bury the stem up to the first leaves to grow stronger roots.',
      'Stake or cage plants early; prune suckers to focus energy on fruit.',
      'Water deeply and consistently to prevent blossom-end rot.',
      'Feed every 2 weeks once flowers appear.',
      'Harvest at full color for the sweetest flavour.'
    ],
    bestFor: ['Terrace', 'Balcony', 'Grow-bags'],
    gradient: 'linear-gradient(135deg, #1A4D35, #2D6A4F)'
  },
  {
    id: 'mint',
    name: 'Mint',
    scientific: 'Mentha spicata',
    category: 'herbs',
    emoji: '🌱',
    difficulty: 'Easy',
    growthTime: '30–50 days',
    sunlight: '4–6 hours partial sun',
    water: 'Daily, loves consistent moisture',
    soil: 'Rich, moist soil, pH 6.0–7.5',
    fertilizer: 'Balanced organic feed monthly',
    season: 'Year-round',
    harvest: 'Snip leaves as needed',
    pests: 'Spider mites, mint rust',
    description: 'Vigorous and forgiving, mint thrives on a windowsill or balcony planter and comes back after every harvest.',
    care: [
      'Keep in its own container — mint spreads aggressively in shared beds.',
      'Pinch off flower buds to keep leaves tender.',
      'Harvest leaves from the top to encourage bushy growth.',
      'Protect from scorching afternoon sun in hot summers.'
    ],
    bestFor: ['Indoor', 'Balcony', 'Kitchen'],
    gradient: 'linear-gradient(135deg, #2D6A4F, #52B788)'
  },
  {
    id: 'tulsi',
    name: 'Tulsi (Holy Basil)',
    scientific: 'Ocimum tenuiflorum',
    category: 'medicinal',
    emoji: '💊',
    difficulty: 'Easy',
    growthTime: '40–60 days',
    sunlight: '6+ hours full sun',
    water: 'Every 1–2 days',
    soil: 'Well-draining loam, pH 6.0–7.5',
    fertilizer: 'Compost every 3–4 weeks',
    season: 'Summer – Monsoon',
    harvest: 'Pick leaves once plant reaches 8 inches',
    pests: 'Aphids, whiteflies',
    description: 'A sacred, antioxidant-rich herb used in teas and remedies, beloved on Indian terraces and balconies.',
    care: [
      'Start seeds in a sunny spot; transplant at 4–6 leaves.',
      'Water when the top inch of soil feels dry.',
      'Pinch growing tips to promote branching.',
      'Bring indoors if temperatures drop below 10°C.'
    ],
    bestFor: ['Terrace', 'Balcony', 'Kitchen'],
    gradient: 'linear-gradient(135deg, #1A4D35, #40916C)'
  },
  {
    id: 'marigold',
    name: 'Marigold',
    scientific: 'Tagetes erecta',
    category: 'flowers',
    emoji: '🌸',
    difficulty: 'Easy',
    growthTime: '60–70 days',
    sunlight: 'Full sun',
    water: 'Every 2–3 days',
    soil: 'Well-draining, sandy loam',
    fertilizer: 'Low nitrogen, flower-boost feed',
    season: 'Summer – Winter',
    harvest: 'Cut blooms regularly to prolong flowering',
    pests: 'Spider mites, slugs',
    description: 'Cheerful, low-maintenance blooms that also deter nematodes when planted near vegetables.',
    care: [
      'Deadhead spent flowers weekly to encourage more blooms.',
      'Grow from seed directly in the pot — no transplanting needed.',
      'Avoid overwatering; let soil dry slightly between waterings.',
      'Plant among tomatoes to repel pests naturally.'
    ],
    bestFor: ['Balcony', 'Terrace', 'Window'],
    gradient: 'linear-gradient(135deg, #9B59B6, #E8B4CB)'
  },
  {
    id: 'snake-plant',
    name: 'Snake Plant',
    scientific: 'Sansevieria trifasciata',
    category: 'indoor',
    emoji: '🏠',
    difficulty: 'Very Easy',
    growthTime: 'Slow grower',
    sunlight: 'Low to bright indirect light',
    water: 'Every 2–3 weeks',
    soil: 'Gritty, well-draining cactus mix',
    fertilizer: 'Cactus feed twice a year',
    season: 'Year-round',
    harvest: 'Divides easily for new plants',
    pests: 'Mealybugs, root rot',
    description: 'Nearly indestructible and a natural air purifier. The perfect starter plant for low-light corners.',
    care: [
      'Water only when the soil is completely dry.',
      'Tolerates neglect better than overwatering.',
      'Keep away from cold drafts in winter.',
      'Divide clumps every few years to propagate.'
    ],
    bestFor: ['Indoor', 'Office', 'Bedroom'],
    gradient: 'linear-gradient(135deg, #264653, #2A9D8F)'
  },
  {
    id: 'money-plant',
    name: 'Money Plant',
    scientific: 'Epipremnum aureum',
    category: 'indoor',
    emoji: '🪴',
    difficulty: 'Very Easy',
    growthTime: 'Fast grower',
    sunlight: 'Bright indirect light',
    water: 'Weekly, once topsoil dries',
    soil: 'General potting mix',
    fertilizer: 'Balanced feed monthly in growing season',
    season: 'Year-round',
    harvest: 'Cut vines for propagation',
    pests: 'Mealybugs, scale',
    description: 'The classic lucky plant — a trailing vine that grows fast in water or soil and is nearly impossible to kill.',
    care: [
      'Grows in water, soil, or a mix of both.',
      'Trim vines to keep the plant bushy and full.',
      'Wipe leaves to keep them dust-free and glossy.',
      'Keep out of direct harsh sun to avoid leaf burn.'
    ],
    bestFor: ['Indoor', 'Balcony', 'Hanging baskets'],
    gradient: 'linear-gradient(135deg, #123524, #40916C)'
  },
  {
    id: 'spinach',
    name: 'Spinach',
    scientific: 'Spinacia oleracea',
    category: 'vegetables',
    emoji: '🥬',
    difficulty: 'Easy',
    growthTime: '30–40 days',
    sunlight: '4–6 hours, cool shade in afternoon',
    soil: 'Rich, moist, well-draining',
    water: 'Every 1–2 days',
    fertilizer: 'Compost at planting, then light feed',
    season: 'Winter – Spring',
    harvest: 'Cut outer leaves from 6 weeks',
    pests: 'Leaf miners, aphids',
    description: 'Fast-growing leafy green perfect for early spring and winter gardens, harvested as baby leaves.',
    care: [
      'Sow seeds 1 inch apart, thin to 4 inches.',
      'Keep soil consistently moist — bolting is triggered by dryness and heat.',
      'Harvest outer leaves first for continuous regrowth.',
      'Grow in partial shade during hot weather.'
    ],
    bestFor: ['Terrace', 'Raised beds', 'Containers'],
    gradient: 'linear-gradient(135deg, #1A4D35, #2D6A4F)'
  },
  {
    id: 'strawberry',
    name: 'Strawberry',
    scientific: 'Fragaria × ananassa',
    category: 'fruits',
    emoji: '🍓',
    difficulty: 'Intermediate',
    growthTime: '60–90 days',
    sunlight: '6+ hours full sun',
    water: 'Every 1–2 days, keep roots moist',
    soil: 'Slightly acidic, rich loam, pH 5.5–6.5',
    fertilizer: 'High-potash feed during fruiting',
    season: 'Winter – Spring',
    harvest: 'Pick fully red berries every morning',
    pests: 'Slugs, birds, powdery mildew',
    description: 'Sweet rewards in a small space — strawberries cascade beautifully from hanging baskets and railing planters.',
    care: [
      'Plant crowns so the base sits at soil level.',
      'Mulch around plants to keep fruit off soil.',
      'Feed with potash once flowers appear.',
      'Protect ripening fruit from birds with netting.'
    ],
    bestFor: ['Hanging baskets', 'Balcony', 'Railing planters'],
    gradient: 'linear-gradient(135deg, #8B4513, #CD853F)'
  },
  {
    id: 'neem',
    name: 'Neem',
    scientific: 'Azadirachta indica',
    category: 'medicinal',
    emoji: '🌿',
    difficulty: 'Easy',
    growthTime: '1–2 years to mature',
    sunlight: 'Full sun',
    water: 'Weekly, drought tolerant once established',
    soil: 'Well-draining, tolerates poor soil',
    fertilizer: 'Organic compost twice a year',
    season: 'Year-round (tropical)',
    harvest: 'Leaves year-round, seeds in summer',
    pests: 'Few — leaves repel many insects',
    description: 'The village pharmacy tree. Neem leaves are used for pest sprays, skincare, and traditional remedies.',
    care: [
      'Grow in a large container with excellent drainage.',
      'Water deeply but infrequently once established.',
      'Make a leaf spray to fight aphids on other plants.',
      'Protect from frost; move indoors in cold regions.'
    ],
    bestFor: ['Terrace', 'Large pots'],
    gradient: 'linear-gradient(135deg, #1A4D35, #40916C)'
  },
  {
    id: 'basil',
    name: 'Basil',
    scientific: 'Ocimum basilicum',
    category: 'herbs',
    emoji: '🌿',
    difficulty: 'Easy',
    growthTime: '25–40 days',
    sunlight: '6–8 hours full sun',
    water: 'Daily in summer, keep moist',
    soil: 'Rich, well-draining, pH 6.0–7.0',
    fertilizer: 'Balanced feed every 3 weeks',
    season: 'Summer – Monsoon',
    harvest: 'Pinch leaves from 6 inches tall',
    pests: 'Aphids, slugs, downy mildew',
    description: 'The quintessential kitchen herb — aromatic, fast-growing, and a magnet for bees when it flowers.',
    care: [
      'Pinch flower buds to keep leaves flavourful.',
      'Harvest from the top, just above a leaf pair.',
      'Water at the base to avoid mildew on leaves.',
      'Protect from cold — basil is frost-tender.'
    ],
    bestFor: ['Kitchen', 'Window', 'Balcony'],
    gradient: 'linear-gradient(135deg, #2D6A4F, #52B788)'
  },
  {
    id: 'rose',
    name: 'Rose',
    scientific: 'Rosa spp.',
    category: 'ornamental',
    emoji: '🌹',
    difficulty: 'Intermediate',
    growthTime: '90–120 days',
    sunlight: '6+ hours full sun',
    water: 'Every 2–3 days, deep watering',
    soil: 'Rich loam, well-draining, pH 6.0–6.5',
    fertilizer: 'Rose feed every 4–6 weeks',
    season: 'Spring – Autumn',
    harvest: 'Cut blooms early morning',
    pests: 'Aphids, blackspot, powdery mildew',
    description: 'The timeless classic — container roses reward regular feeding and pruning with stunning repeat blooms.',
    care: [
      'Plant graft unions above soil level.',
      'Water deeply at the base, never on foliage.',
      'Prune spent flowers to encourage reblooming.',
      'Spray neem solution weekly against blackspot.'
    ],
    bestFor: ['Terrace', 'Large pots', 'Sunny balconies'],
    gradient: 'linear-gradient(135deg, #6B4226, #D4A574)'
  },
  {
    id: 'aloe-vera',
    name: 'Aloe Vera',
    scientific: 'Aloe barbadensis miller',
    category: 'medicinal',
    emoji: '🌵',
    difficulty: 'Very Easy',
    growthTime: 'Slow grower',
    sunlight: 'Bright indirect to full sun',
    water: 'Every 2–3 weeks',
    soil: 'Sandy, fast-draining cactus mix',
    fertilizer: 'Half-strength feed in spring',
    season: 'Year-round',
    harvest: 'Cut outer leaves as needed',
    pests: 'Mealybugs, root rot',
    description: 'The first-aid plant — its cooling gel soothes burns, and it survives on almost zero attention.',
    care: [
      'Let soil dry completely between waterings.',
      'Use a terracotta pot to prevent soggy roots.',
      'Harvest thick outer leaves from the base.',
      'Give it winter rest with minimal water.'
    ],
    bestFor: ['Indoor', 'Window', 'Sunny sills'],
    gradient: 'linear-gradient(135deg, #264653, #2A9D8F)'
  },
  {
    id: 'chilli',
    name: 'Chilli',
    scientific: 'Capsicum annuum',
    category: 'vegetables',
    emoji: '🌶️',
    difficulty: 'Easy',
    growthTime: '70–90 days',
    sunlight: '6+ hours full sun',
    water: 'Every 2 days, do not let wilt',
    soil: 'Well-draining, fertile, pH 6.0–6.8',
    fertilizer: 'Tomato feed weekly once flowering',
    season: 'Summer – Monsoon',
    harvest: 'Pick green for mild or red for heat',
    pests: 'Aphids, fruit borer',
    description: 'Packed with heat and easy to grow, chillies reward hot balconies with a long season of peppers.',
    care: [
      'Start from seed indoors 8 weeks before heat arrives.',
      'Support plants as they load up with fruit.',
      'Pick regularly to keep plants productive.',
      'Reduce watering slightly as fruit ripens.'
    ],
    bestFor: ['Terrace', 'Balcony', 'Grow-bags'],
    gradient: 'linear-gradient(135deg, #1A4D35, #2D6A4F)'
  },
  {
    id: 'peace-lily',
    name: 'Peace Lily',
    scientific: 'Spathiphyllum wallisii',
    category: 'indoor',
    emoji: '🏠',
    difficulty: 'Easy',
    growthTime: 'Fast grower',
    sunlight: 'Low to medium indirect light',
    water: 'Weekly, likes humid air',
    soil: 'Moist, peat-based potting mix',
    fertilizer: 'Balanced feed monthly in spring–summer',
    season: 'Year-round',
    harvest: 'Divide clumps to propagate',
    pests: 'Mealybugs, scale',
    description: 'Elegant white spathes and glossy leaves that tell you when they\'re thirsty by drooping dramatically.',
    care: [
      'Water when leaves begin to droop.',
      'Mist regularly to raise humidity.',
      'Wipe leaves monthly to keep pores open.',
      'Keep away from direct sun to avoid scorch.'
    ],
    bestFor: ['Indoor', 'Bathroom', 'Office'],
    gradient: 'linear-gradient(135deg, #123524, #40916C)'
  },
  {
    id: 'coriander',
    name: 'Coriander',
    scientific: 'Coriandrum sativum',
    category: 'herbs',
    emoji: '🌿',
    difficulty: 'Easy',
    growthTime: '30–45 days',
    sunlight: '4–6 hours, morning sun',
    water: 'Daily, keep moist',
    soil: 'Light, well-draining soil',
    fertilizer: 'Liquid feed every 3 weeks',
    season: 'Winter – Spring (cool season)',
    harvest: 'Cut outer stems from 3 weeks',
    pests: 'Aphids, caterpillars',
    description: 'Essential in Indian kitchens. Grows quickly but bolts fast in heat, so sow new seeds every few weeks.',
    care: [
      'Sow seeds directly — coriander dislikes transplanting.',
      'Sow in succession every 2 weeks for steady supply.',
      'Harvest outer leaves, leaving the center to grow.',
      'Grow in partial shade to delay bolting.'
    ],
    bestFor: ['Kitchen', 'Balcony', 'Window'],
    gradient: 'linear-gradient(135deg, #2D6A4F, #52B788)'
  },
  {
    id: 'brinjal',
    name: 'Brinjal (Eggplant)',
    scientific: 'Solanum melongena',
    category: 'vegetables',
    emoji: '🍆',
    difficulty: 'Intermediate',
    growthTime: '80–100 days',
    sunlight: '6–8 hours full sun',
    water: 'Every 2 days, consistent moisture',
    soil: 'Rich, well-draining loam, pH 5.5–6.5',
    fertilizer: 'Balanced feed weekly when fruiting',
    season: 'Summer – Monsoon',
    harvest: 'Pick glossy, firm fruit before seeds form',
    pests: 'Fruit borer, aphids, mites',
    description: 'A warm-season staple that fruits heavily in large pots, giving beautiful glossy purple harvests.',
    care: [
      'Stake tall varieties as they begin fruiting.',
      'Water evenly to avoid bitter, misshapen fruit.',
      'Pinch the first flowers to encourage branching.',
      'Inspect regularly for fruit borer damage.'
    ],
    bestFor: ['Terrace', 'Large pots', 'Grow-bags'],
    gradient: 'linear-gradient(135deg, #1A4D35, #2D6A4F)'
  },
  {
    id: 'lavender',
    name: 'Lavender',
    scientific: 'Lavandula angustifolia',
    category: 'ornamental',
    emoji: '💜',
    difficulty: 'Intermediate',
    growthTime: '90–120 days',
    sunlight: 'Full sun, 6+ hours',
    water: 'Every 5–7 days, let dry between',
    soil: 'Alkaline, gritty, excellent drainage',
    fertilizer: 'Little to none; too rich kills it',
    season: 'Spring – Summer',
    harvest: 'Cut stems before flowers fully open',
    pests: 'Froghoppers, root rot',
    description: 'Fragrant purple spires that love hot, dry spots — perfect for sunny balconies and drought-tolerant planting.',
    care: [
      'Use sandy, gritty soil with sharp drainage.',
      'Water rarely — overwatering is the #1 killer.',
      'Prune lightly each spring to keep woody base tidy.',
      'Harvest stems for drying before buds open.'
    ],
    bestFor: ['Sunny balconies', 'Terrace', 'Rock gardens'],
    gradient: 'linear-gradient(135deg, #6B4226, #D4A574)'
  },
  {
    id: 'kadipatta',
    name: 'Curry Leaf (Kadipatta)',
    scientific: 'Murraya koenigii',
    category: 'medicinal',
    emoji: '🍃',
    difficulty: 'Easy',
    growthTime: 'Slow, perennial',
    sunlight: '4–6 hours partial to full sun',
    water: 'Every 2–3 days',
    soil: 'Well-draining potting mix',
    fertilizer: 'Compost monthly in growing season',
    season: 'Year-round',
    harvest: 'Pluck leaves as needed from 1 year',
    pests: 'Scale insects, aphids',
    description: 'The soul of South Indian cooking. A curry leaf plant on the terrace means fresh tempering on demand.',
    care: [
      'Grow in a pot at least 12 inches deep.',
      'Pluck leaves regularly to encourage new growth.',
      'Feed generously — curry leaf is a heavy feeder.',
      'Keep in a sheltered spot during winter chill.'
    ],
    bestFor: ['Terrace', 'Balcony', 'Kitchen'],
    gradient: 'linear-gradient(135deg, #1A4D35, #40916C)'
  },
  {
    id: 'sunflower',
    name: 'Sunflower',
    scientific: 'Helianthus annuus',
    category: 'flowers',
    emoji: '🌻',
    difficulty: 'Easy',
    growthTime: '70–90 days',
    sunlight: 'Full sun, 6–8 hours',
    water: 'Every 2 days, deep soak',
    soil: 'Well-draining, average fertility',
    fertilizer: 'Compost at planting time',
    season: 'Summer – Monsoon',
    harvest: 'Save seeds when heads droop and dry',
    pests: 'Birds, squirrels, aphids',
    description: 'Nothing says summer like a sunflower. Tall varieties love direct sowing in large pots or garden beds.',
    care: [
      'Sow seeds directly 1 inch deep after frost.',
      'Stake tall varieties in windy balconies.',
      'Water deeply at the base, not on the head.',
      'Leave seed heads to dry for harvesting seeds.'
    ],
    bestFor: ['Terrace', 'Raised beds', 'Garden'],
    gradient: 'linear-gradient(135deg, #9B59B6, #E8B4CB)'
  },
  {
    id: 'carrot',
    name: 'Carrot',
    scientific: 'Daucus carota',
    category: 'vegetables',
    emoji: '🥕',
    difficulty: 'Easy',
    growthTime: '70–80 days',
    sunlight: '6+ hours full sun',
    water: 'Every 2 days, keep evenly moist',
    soil: 'Deep, loose, sandy soil — no rocks',
    fertilizer: 'Low nitrogen, avoid fresh manure',
    season: 'Winter – Spring',
    harvest: 'Pull when tops reach 1 inch wide',
    pests: 'Carrot fly, aphids',
    description: 'Crisp and sweet, carrots need deep loose soil and consistent moisture to form straight, tasty roots.',
    care: [
      'Use deep containers (12+ inches) for straight roots.',
      'Thin seedlings to 3 inches apart.',
      'Keep soil evenly moist to prevent splitting.',
      'Harvest in the evening for the sweetest crunch.'
    ],
    bestFor: ['Deep containers', 'Terrace', 'Raised beds'],
    gradient: 'linear-gradient(135deg, #1A4D35, #2D6A4F)'
  },
  {
    id: 'geranium',
    name: 'Geranium',
    scientific: 'Pelargonium spp.',
    category: 'flowers',
    emoji: '🌸',
    difficulty: 'Easy',
    growthTime: '60–80 days',
    sunlight: 'Full sun to partial shade',
    water: 'Every 2–3 days',
    soil: 'Well-draining potting mix',
    fertilizer: 'High-potash feed every 2 weeks',
    season: 'Spring – Autumn',
    harvest: 'Deadhead spent flowers weekly',
    pests: 'Aphids, whiteflies',
    description: 'Reliable, colorful bloomers that thrive in pots and window boxes with minimal fuss.',
    care: [
      'Deadhead regularly for nonstop blooms.',
      'Let soil dry slightly between waterings.',
      'Pinch young plants to encourage fullness.',
      'Move to shelter in heavy rain or frost.'
    ],
    bestFor: ['Window boxes', 'Balcony', 'Terrace'],
    gradient: 'linear-gradient(135deg, #9B59B6, #E8B4CB)'
  },
  {
    id: 'lemon',
    name: 'Lemon',
    scientific: 'Citrus limon',
    category: 'fruits',
    emoji: '🍋',
    difficulty: 'Intermediate',
    growthTime: '1–2 years to fruit',
    sunlight: '6–8 hours full sun',
    water: 'Every 2–3 days in summer',
    soil: 'Acidic, well-draining citrus mix',
    fertilizer: 'Citrus feed monthly in growing season',
    season: 'Year-round (multiple crops)',
    harvest: 'Pick when fully yellow and fragrant',
    pests: 'Citrus leaf miner, scale, mealybugs',
    description: 'A fragrant dwarf citrus that fruits indoors and out, filling the air with blossom scent in spring.',
    care: [
      'Choose a dwarf grafted variety for pots.',
      'Feed a dedicated citrus fertilizer regularly.',
      'Protect from cold — move indoors in winter.',
      'Watch for curling leaves signalling leaf miner.'
    ],
    bestFor: ['Terrace', 'Sunny balconies', 'Large pots'],
    gradient: 'linear-gradient(135deg, #8B4513, #CD853F)'
  },
  {
    id: 'fern',
    name: 'Boston Fern',
    scientific: 'Nephrolepis exaltata',
    category: 'ornamental',
    emoji: '🌿',
    difficulty: 'Easy',
    growthTime: 'Fast grower',
    sunlight: 'Bright, indirect light',
    water: 'Every 1–2 days, loves humidity',
    soil: 'Moist, well-draining mix',
    fertilizer: 'Weak liquid feed monthly',
    season: 'Year-round',
    harvest: 'Divide for new plants in spring',
    pests: 'Spider mites, scale',
    description: 'Lush, airy fronds that love humidity and bright shade — gorgeous in hanging baskets or on shelves.',
    care: [
      'Mist daily, especially in dry indoor air.',
      'Never let the root ball dry out completely.',
      'Trim brown fronds at the base.',
      'Keep in a bathroom for natural humidity.'
    ],
    bestFor: ['Indoor', 'Hanging baskets', 'Bathroom'],
    gradient: 'linear-gradient(135deg, #264653, #2A9D8F)'
  }
];

const PLANT_CATEGORIES = [
  { id: 'all', label: 'All Plants', icon: '🌿' },
  { id: 'vegetables', label: 'Vegetables', icon: '🥬' },
  { id: 'fruits', label: 'Fruits', icon: '🍅' },
  { id: 'herbs', label: 'Herbs', icon: '🌿' },
  { id: 'flowers', label: 'Flowers', icon: '🌸' },
  { id: 'medicinal', label: 'Medicinal', icon: '💊' },
  { id: 'indoor', label: 'Indoor Plants', icon: '🏠' },
  { id: 'ornamental', label: 'Ornamental', icon: '🪴' }
];

const PlantDB = {
  all: () => PLANTS,

  byId: (id) => PLANTS.find((p) => p.id === id),

  categoryLabel: (id) => {
    const c = PLANT_CATEGORIES.find((cat) => cat.id === id);
    return c ? c.label : id;
  },

  search(query) {
    const q = query.trim().toLowerCase();
    if (!q) return PLANTS;
    return PLANTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.scientific.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PLANTS, PLANT_CATEGORIES, PlantDB };
}
