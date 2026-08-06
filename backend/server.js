require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const plantRoutes = require('./routes/plants');
const authRoutes = require('./routes/auth');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api', (req, res) => {
  res.json({
    name: 'GrowWise API',
    endpoints: ['/api/plants', '/api/auth/register', '/api/auth/login', '/api/auth/me']
  });
});

app.use('/api/plants', plantRoutes);
app.use('/api/auth', authRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/growwise';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🌿 GrowWise API running at http://localhost:${PORT}`);
      console.log(`📦 Connected to MongoDB: ${MONGO_URI}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    console.log('   Is MongoDB running? Try: brew services start mongodb-community');
    process.exit(1);
  });
