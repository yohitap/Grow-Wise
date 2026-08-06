/**
 * GrowWise — Organic Pest & Disease Management
 * Organic, chemical-free treatments for common garden pests and diseases.
 */

'use strict';

const PESTS = [
  {
    id: 'aphids', type: 'pest', name: 'Aphids', emoji: '🐜', severity: 'low',
    gradient: 'linear-gradient(135deg, #2D6A4F, #52B788)',
    description: 'Tiny green or black sap-suckers that cluster on new shoots and under leaves, causing curled, sticky foliage.',
    affected: ['Most vegetables', 'Roses', 'Herbs', 'Citrus'],
    symptoms: ['Curled, distorted new growth', 'Sticky honeydew on leaves', 'Ants farming the colony'],
    treatment: [
      'Blast insects off with a sharp stream of water.',
      'Spray a neem-oil mix (5 ml neem oil + drops of soap in 1 L water) every 5–7 days.',
      'Trim and dispose of heavily infested shoot tips.'
    ],
    prevention: [
      'Attract ladybirds by planting marigolds and dill.',
      'Avoid high-nitrogen feeds that spur sappy growth.',
      'Check under leaves weekly.'
    ]
  },
  {
    id: 'whiteflies', type: 'pest', name: 'Whiteflies', emoji: '🦋', severity: 'moderate',
    gradient: 'linear-gradient(135deg, #1A4D35, #3D6B52)',
    description: 'Small white winged insects that swarm when disturbed, feeding on sap and spreading viral diseases.',
    affected: ['Tomatoes', 'Brinjal', 'Cucumbers', 'Indoor plants'],
    symptoms: ['White cloud on disturbance', 'Yellow, mottled leaves', 'Sooty mould on honeydew'],
    treatment: [
      'Hang yellow sticky traps to catch adults.',
      'Spray neem or a soap-water solution (1 tsp soap in 1 L water) weekly.',
      'Vacuum large infestations in the cool morning.'
    ],
    prevention: [
      'Space plants for airflow.',
      'Remove heavily infested lower leaves.',
      'Companion-plant lemongrass and marigold.'
    ]
  },
  {
    id: 'spider-mites', type: 'pest', name: 'Spider Mites', emoji: '🕷️', severity: 'moderate',
    gradient: 'linear-gradient(135deg, #6B4F2A, #A87B45)',
    description: 'Tiny pests that thrive in hot, dry conditions, leaving stippled leaves and fine webbing.',
    affected: ['Indoor plants', 'Cucurbits', 'Roses', 'Lemon'],
    symptoms: ['Fine webbing on leaves', 'Tiny yellow stippling', 'Leaves turn bronze and drop'],
    treatment: [
      'Increase humidity — mites hate moisture.',
      'Mist plants and spray neem solution weekly.',
      'Prune and bag badly infested foliage.'
    ],
    prevention: ['Keep plants well-watered in heat', 'Avoid dusty conditions', 'Inspect undersides frequently']
  },
  {
    id: 'mealybugs', type: 'pest', name: 'Mealybugs', emoji: '🐞', severity: 'moderate',
    gradient: 'linear-gradient(135deg, #DCD3C3, #B8AE9A)',
    description: 'Soft, cottony insects that gather at leaf joints and suck sap, weakening growth over time.',
    affected: ['Indoor plants', 'Succulents', 'Fruit trees'],
    symptoms: ['Cottony white masses', 'Sticky, waxy residue', 'Stunted, yellowing growth'],
    treatment: [
      'Dab each insect with rubbing alcohol on a cotton bud.',
      'Wash off with a soap-and-water spray.',
      'Repeat weekly until the infestation clears.'
    ],
    prevention: ['Quarantine new plants', 'Wipe leaves monthly', 'Keep humidity moderate']
  },
  {
    id: 'caterpillars', type: 'pest', name: 'Caterpillars & Worms', emoji: '🐛', severity: 'moderate',
    gradient: 'linear-gradient(135deg, #3A5F3A, #5F8B5F)',
    description: 'Leaf-eating larvae that chew ragged holes and skeletonise leafy greens overnight.',
    affected: ['Cabbage', 'Kale', 'Spinach', 'Marigold'],
    symptoms: ['Ragged leaf holes', 'Green droppings', 'Visible caterpillars at dusk'],
    treatment: [
      'Hand-pick caterpillars each evening.',
      'Dust leaves with fine wood ash or chilli powder.',
      'Spray neem or a Bacillus thuringiensis solution.'
    ],
    prevention: ['Use row covers at night', 'Plant mint nearby', 'Encourage birds in the garden']
  },
  {
    id: 'snails-slugs', type: 'pest', name: 'Snails & Slugs', emoji: '🐌', severity: 'low',
    gradient: 'linear-gradient(135deg, #7A6B52, #A89A7F)',
    description: 'Damp-loving mollusks that feed at night, leaving holes and silvery slime trails.',
    affected: ['Young seedlings', 'Leafy greens', 'Basil', 'Hostas'],
    symptoms: ['Irregular holes in leaves', 'Shiny slime trails', 'Damage worst after rain'],
    treatment: [
      'Nothing-beats hand-picking at dusk.',
      'Place a shallow beer trap sunk at soil level.',
      'Ring plants with crushed eggshells or coffee grounds.'
    ],
    prevention: ['Water in the morning', 'Remove leaf litter and boards', 'Keep soil surface dry']
  },
  {
    id: 'fruit-borer', type: 'pest', name: 'Fruit Borer', emoji: '🪱', severity: 'high',
    gradient: 'linear-gradient(135deg, #8B5A2B, #B07A3F)',
    description: 'The ravenous pest of brinjal and chillies — larvae bore inside fruit, ruining the harvest.',
    affected: ['Brinjal', 'Chilli', 'Capsicum', 'Okra'],
    symptoms: ['Holes with dark frass', 'Fruit rots on vine', 'Wilted, bored shoots'],
    treatment: [
      'Remove and burn drooping infested shoots.',
      'Spray neem oil every 5–7 days during fruiting.',
      'Hand-pick and zero-out affected fruit.'
    ],
    prevention: [
      'Use pheromone traps to catch adults.',
      'Intercrop with marigolds to distract.',
      'Destroy dropped fruit promptly.'
    ]
  },
  {
    id: 'leaf-miners', type: 'pest', name: 'Leaf Miners', emoji: '🌿', severity: 'low',
    gradient: 'linear-gradient(135deg, #52B788, #95D5B2)',
    description: 'Fly larvae tunnel pale winding trails inside leaves, reducing photosynthesis.',
    affected: ['Spinach', 'Tomatoes', 'Citrus', 'Vegetables'],
    symptoms: ['White/maggy serpentine trails', 'Feeding flies hovering', 'Patchy leaf yellowing'],
    treatment: [
      'Pick off and destroy mined leaves (hosts after escaping).',
      'Spray a neem solution to deter adults.',
      'Use yellow sticky traps near the soil line.'
    ],
    prevention: ['Cover young crops with fine netting', 'Remove leaf mines early', 'Clear plant debris']
  },
  {
    id: 'powdery-mildew', type: 'disease', name: 'Powdery Mildew', emoji: '🌫️', severity: 'moderate',
    gradient: 'linear-gradient(135deg, #8A9A90, #C2CCC6)',
    description: 'A white powdery fungal coat on leaves that thrives in humid, stagnant air and warm days.',
    affected: ['Cucurbits', 'Roses', 'Peas', 'Zinnias'],
    symptoms: ['White dusty spots', 'Distorted, dry leaves', 'Wrinkled surface on leaves'],
    treatment: [
      'Remove and discard affected leaves.',
      'Spray a mix of 1 part milk to 9 parts water weekly.',
      'Improve airflow and reduce overhead humidity.'
    ],
    prevention: ['Water the base only', 'Space plants generously', 'Avoid wetting foliage late in the day']
  },
  {
    id: 'downy-mildew', type: 'disease', name: 'Downy Mildew', emoji: '🌧️', severity: 'high',
    gradient: 'linear-gradient(135deg, #40916C, #1A4D35)',
    description: 'Yellow blotches with fluffy grey fuzz on the leaf underside, worsened by cool damp periods.',
    affected: ['Cucumbers', 'Grapes', 'Lettuce', 'Onion'],
    symptoms: ['Angular yellow patches', 'Grey fuzz underneath', 'Symptoms spread quickly'],
    treatment: [
      'Remove infected foliage at once.',
      'Apply baking soda spray (1 tsp + drops soap in 1 L).',
      'Water early morning so leaves dry by nightfall.'
    ],
    prevention: ['Improve drainage & spacing', 'Water at ground level', 'Avoid overhead wetting']
  },
  {
    id: 'black-spot', type: 'disease', name: 'Black Spot', emoji: '⚫', severity: 'moderate',
    gradient: 'linear-gradient(135deg, #3A3A3A, #5A5A5A)',
    description: 'Round black spots with ragged edges that yellow around them, common on rose foliage.',
    affected: ['Roses', 'Fruit trees'],
    symptoms: ['Dark circular spots', 'Yellow halos', 'Premature leaf drop'],
    treatment: [
      'Strip spotted leaves and remove from garden.',
      'Spray neem weekly in the evening.',
      'Mulch soil to stop spore splash.'
    ],
    prevention: ['Water at the base only', 'Prune for good airflow', 'Feed for strong growth']
  },
  {
    id: 'root-rot', type: 'disease', name: 'Root Rot', emoji: '🥀', severity: 'severe',
    gradient: 'linear-gradient(135deg, #4E342E, #6D4C41)',
    description: 'Fungal decay in soggy soils that makes plants wilt despite wet roots turning brown and mushy.',
    affected: ['Most houseplants', 'Succulents', 'Potted plants'],
    symptoms: ['Wilting despite wet soil', 'Brown, mushy roots', 'Sickly, sour soil smell'],
    treatment: [
      'Stop watering and remove plant from pot.',
      'Trim the dark, mushy roots with clean scissors.',
      'Repot in fresh, gritty mix and allow to dry out fully.'
    ],
    prevention: ['Ensure drainage holes', 'Use gritty mix', 'Water only when soil dries']
  },
  {
    id: 'late-blight', type: 'disease', name: 'Late Blight', emoji: '🍅', severity: 'severe',
    gradient: 'linear-gradient(135deg, #8B0000, #B24A2A)',
    description: 'A destructive tomato and potato wilt with dark water-soaked patches that kills foliage fast in wet weather.',
    affected: ['Tomatoes', 'Potatoes'],
    symptoms: ['Dark, greasy leaf spots', 'White fuzz on damp days', 'Rapid collapse'],
    treatment: [
      'Isolate and burn infected plants immediately.',
      'Spray copper-organic or neem preventively.',
      'Never compost infected plant tissue.'
    ],
    prevention: ['Water foliage at base', 'Plant spaced upright', 'Choose tolerances']
  },
  {
    id: 'damping-off', type: 'disease', name: 'Damping Off', emoji: '🌱', severity: 'high',
    gradient: 'linear-gradient(135deg, #2E3B2E, #4E6B4E)',
    description: 'A fatal seedling disease where strong young stems rot and fall within days of germination.',
    affected: ['All seedlings', 'Cuttings'],
    symptoms: ['Collar girdling at the base', 'Sudden flopping', 'Poor stem growth'],
    treatment: [
      'Remove floppy seedlings at first signs.',
      'Top-dress the soil with a sprinkle of cinnamon powder.',
      'Improve circulation and light for survivors.'
    ],
    prevention: ['Sterile seedling mix only', 'Avoid overwatering', 'Bottom ventilation and air']
  }
];

const PEST_CATEGORIES = [
  { id: 'all', label: 'All Problems', icon: '🌿' },
  { id: 'pest', label: 'Pests', icon: '🐛' },
  { id: 'disease', label: 'Diseases', icon: '🌡️' }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PESTS, PEST_CATEGORIES };
}