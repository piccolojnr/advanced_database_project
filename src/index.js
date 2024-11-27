const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
require('dotenv').config();

// Import models
const Species = require('./models/Species');
const User = require('./models/User');

// Import routes
const authRoutes = require('./routes/auth');
const speciesRoutes = require('./routes/species');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/species', speciesRoutes);

// Basic error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Database initialization
async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    // Sync all models
    await sequelize.sync({ alter: true });
    console.log('Database models synchronized successfully.');

    // Create admin user if it doesn't exist
    const adminExists = await User.findOne({ where: { role: 'ADMIN' } });
    if (!adminExists) {
      await User.create({
        username: 'admin',
        email: 'admin@rainforestexotics.com',
        password: 'admin123', // Change this in production
        role: 'ADMIN'
      });
      console.log('Admin user created successfully');
    }
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

// Initialize database
initializeDatabase();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
