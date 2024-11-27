const express = require('express');
const { Op } = require('sequelize');
const Species = require('../models/Species');
const { auth, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Create new species (admin only)
router.post('/', auth, isAdmin, async (req, res) => {
  try {
    const species = await Species.create(req.body);
    res.status(201).json(species);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all species with filtering
router.get('/', auth, async (req, res) => {
  try {
    const { type, status, search } = req.query;
    const where = {};

    if (type) where.type = type;
    if (status) where.status = status;
    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { scientificName: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const species = await Species.findAll({ where });
    res.json(species);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single species by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const species = await Species.findByPk(req.params.id);
    if (!species) {
      return res.status(404).json({ error: 'Species not found' });
    }
    res.json(species);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update species (admin only)
router.put('/:id', auth, isAdmin, async (req, res) => {
  try {
    const species = await Species.findByPk(req.params.id);
    if (!species) {
      return res.status(404).json({ error: 'Species not found' });
    }

    await species.update(req.body);
    res.json(species);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update species quantity (staff can do this)
router.patch('/:id/quantity', auth, async (req, res) => {
  try {
    const { quantity } = req.body;
    const species = await Species.findByPk(req.params.id);
    
    if (!species) {
      return res.status(404).json({ error: 'Species not found' });
    }

    const newQuantity = parseInt(quantity);
    if (isNaN(newQuantity)) {
      return res.status(400).json({ error: 'Invalid quantity value' });
    }

    await species.update({
      quantity: newQuantity,
      status: newQuantity === 0 ? 'OUT_OF_STOCK' : 'AVAILABLE'
    });

    // Check if quantity is below threshold
    if (newQuantity <= species.minimumThreshold) {
      // In a real application, you would trigger notifications here
      console.log(`Low stock alert for ${species.name}: ${newQuantity} remaining`);
    }

    res.json(species);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete species (admin only)
router.delete('/:id', auth, isAdmin, async (req, res) => {
  try {
    const species = await Species.findByPk(req.params.id);
    if (!species) {
      return res.status(404).json({ error: 'Species not found' });
    }

    await species.destroy();
    res.json({ message: 'Species deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
