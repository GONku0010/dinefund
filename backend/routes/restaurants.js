const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../config/database');
const { auth, requireRole } = require('../middleware/auth');

const router = express.Router();

// Create restaurant (restaurant owners only)
router.post('/', [
  auth,
  requireRole('restaurant_owner'),
  body('name').trim().notEmpty(),
  body('cuisine_type').trim().notEmpty(),
  body('location').trim().notEmpty(),
  body('description').trim().notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, cuisine_type, location, address, description, image_url } = req.body;

    const result = await pool.query(
      `INSERT INTO restaurants (owner_id, name, cuisine_type, location, address, description, image_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [req.user.id, name, cuisine_type, location, address, description, image_url]
    );

    res.status(201).json({
      message: 'Restaurant created successfully',
      restaurant: result.rows[0]
    });
  } catch (error) {
    console.error('Create restaurant error:', error);
    res.status(500).json({ error: 'Server error creating restaurant' });
  }
});

// Get all restaurants
router.get('/', async (req, res) => {
  try {
    const { cuisine_type, location } = req.query;
    let query = `
      SELECT r.*, u.full_name as owner_name,
             COUNT(DISTINCT c.id) as campaign_count
      FROM restaurants r
      LEFT JOIN users u ON r.owner_id = u.id
      LEFT JOIN campaigns c ON r.id = c.restaurant_id
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 1;

    if (cuisine_type) {
      query += ` AND r.cuisine_type ILIKE $${paramCount}`;
      params.push(`%${cuisine_type}%`);
      paramCount++;
    }

    if (location) {
      query += ` AND r.location ILIKE $${paramCount}`;
      params.push(`%${location}%`);
      paramCount++;
    }

    query += ` GROUP BY r.id, u.full_name ORDER BY r.created_at DESC`;

    const result = await pool.query(query, params);
    res.json({ restaurants: result.rows });
  } catch (error) {
    console.error('Get restaurants error:', error);
    res.status(500).json({ error: 'Server error fetching restaurants' });
  }
});

// Get single restaurant
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT r.*, u.full_name as owner_name, u.email as owner_email
       FROM restaurants r
       LEFT JOIN users u ON r.owner_id = u.id
       WHERE r.id = $1`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    // Get campaigns for this restaurant
    const campaigns = await pool.query(
      'SELECT * FROM campaigns WHERE restaurant_id = $1 ORDER BY created_at DESC',
      [req.params.id]
    );

    res.json({
      restaurant: result.rows[0],
      campaigns: campaigns.rows
    });
  } catch (error) {
    console.error('Get restaurant error:', error);
    res.status(500).json({ error: 'Server error fetching restaurant' });
  }
});

// Update restaurant (owner only)
router.put('/:id', [
  auth,
  requireRole('restaurant_owner')
], async (req, res) => {
  try {
    // Verify ownership
    const ownership = await pool.query(
      'SELECT owner_id FROM restaurants WHERE id = $1',
      [req.params.id]
    );

    if (ownership.rows.length === 0) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    if (ownership.rows[0].owner_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to update this restaurant' });
    }

    const { name, cuisine_type, location, address, description, image_url } = req.body;

    const result = await pool.query(
      `UPDATE restaurants 
       SET name = COALESCE($1, name),
           cuisine_type = COALESCE($2, cuisine_type),
           location = COALESCE($3, location),
           address = COALESCE($4, address),
           description = COALESCE($5, description),
           image_url = COALESCE($6, image_url),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $7
       RETURNING *`,
      [name, cuisine_type, location, address, description, image_url, req.params.id]
    );

    res.json({
      message: 'Restaurant updated successfully',
      restaurant: result.rows[0]
    });
  } catch (error) {
    console.error('Update restaurant error:', error);
    res.status(500).json({ error: 'Server error updating restaurant' });
  }
});

// Get restaurants owned by current user
router.get('/my/restaurants', auth, requireRole('restaurant_owner'), async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT r.*, 
              COUNT(DISTINCT c.id) as campaign_count,
              COALESCE(SUM(c.current_funding), 0) as total_funding
       FROM restaurants r
       LEFT JOIN campaigns c ON r.id = c.restaurant_id
       WHERE r.owner_id = $1
       GROUP BY r.id
       ORDER BY r.created_at DESC`,
      [req.user.id]
    );

    res.json({ restaurants: result.rows });
  } catch (error) {
    console.error('Get my restaurants error:', error);
    res.status(500).json({ error: 'Server error fetching restaurants' });
  }
});

module.exports = router;
