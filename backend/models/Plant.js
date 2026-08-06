const mongoose = require('mongoose');

const plantSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  scientific: String,
  category: { type: String, required: true, index: true },
  emoji: String,
  difficulty: String,
  growthTime: String,
  sunlight: String,
  water: String,
  soil: String,
  fertilizer: String,
  season: String,
  harvest: String,
  pests: String,
  description: String,
  care: [String],
  bestFor: [String],
  gradient: String
}, { timestamps: true });

module.exports = mongoose.model('Plant', plantSchema);
