
require('dotenv').config();

const mongoose = require('mongoose');
const Plant = require('./models/Plant');
const { PLANTS } = require('../js/plants');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/growwise';

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('📦 Connected to MongoDB');

  await Plant.deleteMany({});
  const docs = PLANTS.map((p) => ({ ...p, _id: undefined }));
  const result = await Plant.insertMany(docs);

  console.log(`✅ Seeded ${result.length} plants`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});
