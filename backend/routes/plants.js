const express = require('express');
const router = express.Router();
const Plant = require('../models/Plant');


router.get('/', async (req, res) => {
  try {
    const { q, category } = req.query;
    const query = {};

    if (category && category !== 'all') {
      query.category = category;
    }
    if (q) {
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { scientific: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } }
      ];
    }

    const plants = await Plant.find(query).sort({ name: 1 });
    res.json({ count: plants.length, plants });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const plant = await Plant.findOne({ id: req.params.id });
    if (!plant) return res.status(404).json({ message: 'Plant not found' });
    res.json(plant);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
