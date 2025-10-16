const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../config/database');
const { auth, requireRole } = require('../middleware/auth');

const router = express.Router();

// Create campaign (restaurant owners only)
router.post('/', [
  auth,
  requireRole('restaurant_owner'),
  body('restaurant_id').isUUID(),
  body('title').trim().notEmpty(),
  body('description').trim().notEmpty(),
  body('funding_goal').isFloat({ min: 1 }),
  body('interest_rate').isFloat({ min: 0 }),
  body('duration_months').isInt({ min: 1 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { restaurant_id, title, description, funding_goal, interest_rate, duration_months, end_date } = req.body;

    // Verify restaurant ownership
    const restaurant = await pool.query(
      'SELECT owner_id FROM restaurants WHERE id = $1',
      [restaurant_id]
    );

    if (restaurant.rows.length === 0) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    if (restaurant.rows[0].owner_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to create campaign for this restaurant' });
    }

    const result = await pool.query(
      `INSERT INTO campaigns (restaurant_id, title, description, funding_goal, interest_rate, duration_months, end_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [restaurant_id, title, description, funding_goal, interest_rate, duration_months, end_date]
    );

    res.status(201).json({
      message: 'Campaign created successfully',
      campaign: result.rows[0]
    });
  } catch (error) {
    console.error('Create campaign error:', error);
    res.status(500).json({ error: 'Server error creating campaign' });
  }
});

// Get all campaigns with filters
router.get('/', async (req, res) => {
  try {
    const { status, cuisine_type, location, min_funding, max_funding } = req.query;
    
    let query = `
      SELECT c.*, 
             r.name as restaurant_name,
             r.cuisine_type,
             r.location,
             r.image_url as restaurant_image,
             COUNT(DISTINCT i.id) as investor_count,
             ROUND((c.current_funding / c.funding_goal * 100)::numeric, 2) as funding_percentage
      FROM campaigns c
      JOIN restaurants r ON c.restaurant_id = r.id
      LEFT JOIN investments i ON c.id = i.campaign_id
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 1;

    if (status) {
      query += ` AND c.status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }

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

    if (min_funding) {
      query += ` AND c.funding_goal >= $${paramCount}`;
      params.push(min_funding);
      paramCount++;
    }

    if (max_funding) {
      query += ` AND c.funding_goal <= $${paramCount}`;
      params.push(max_funding);
      paramCount++;
    }

    query += ` GROUP BY c.id, r.name, r.cuisine_type, r.location, r.image_url
               ORDER BY c.created_at DESC`;

    const result = await pool.query(query, params);
    res.json({ campaigns: result.rows });
  } catch (error) {
    console.error('Get campaigns error:', error);
    res.status(500).json({ error: 'Server error fetching campaigns' });
  }
});

// Get single campaign
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT c.*, 
             r.name as restaurant_name,
             r.cuisine_type,
             r.location,
             r.address,
             r.description as restaurant_description,
             r.image_url as restaurant_image,
             COUNT(DISTINCT i.id) as investor_count,
             ROUND((c.current_funding / c.funding_goal * 100)::numeric, 2) as funding_percentage
      FROM campaigns c
      JOIN restaurants r ON c.restaurant_id = r.id
      LEFT JOIN investments i ON c.id = i.campaign_id
      WHERE c.id = $1
      GROUP BY c.id, r.name, r.cuisine_type, r.location, r.address, r.description, r.image_url`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    res.json({ campaign: result.rows[0] });
  } catch (error) {
    console.error('Get campaign error:', error);
    res.status(500).json({ error: 'Server error fetching campaign' });
  }
});

// Update campaign (owner only)
router.put('/:id', [
  auth,
  requireRole('restaurant_owner')
], async (req, res) => {
  try {
    // Verify ownership through restaurant
    const ownership = await pool.query(
      `SELECT r.owner_id 
       FROM campaigns c
       JOIN restaurants r ON c.restaurant_id = r.id
       WHERE c.id = $1`,
      [req.params.id]
    );

    if (ownership.rows.length === 0) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    if (ownership.rows[0].owner_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to update this campaign' });
    }

    const { title, description, status, end_date } = req.body;

    const result = await pool.query(
      `UPDATE campaigns 
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           status = COALESCE($3, status),
           end_date = COALESCE($4, end_date),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $5
       RETURNING *`,
      [title, description, status, end_date, req.params.id]
    );

    res.json({
      message: 'Campaign updated successfully',
      campaign: result.rows[0]
    });
  } catch (error) {
    console.error('Update campaign error:', error);
    res.status(500).json({ error: 'Server error updating campaign' });
  }
});

// Get investments for a campaign (owner only)
router.get('/:id/investments', auth, requireRole('restaurant_owner'), async (req, res) => {
  try {
    // Verify ownership
    const ownership = await pool.query(
      `SELECT r.owner_id 
       FROM campaigns c
       JOIN restaurants r ON c.restaurant_id = r.id
       WHERE c.id = $1`,
      [req.params.id]
    );

    if (ownership.rows.length === 0) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    if (ownership.rows[0].owner_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to view investments' });
    }

    const result = await pool.query(
      `SELECT i.*, u.full_name as investor_name, u.email as investor_email
       FROM investments i
       JOIN users u ON i.investor_id = u.id
       WHERE i.campaign_id = $1
       ORDER BY i.investment_date DESC`,
      [req.params.id]
    );

    res.json({ investments: result.rows });
  } catch (error) {
    console.error('Get campaign investments error:', error);
    res.status(500).json({ error: 'Server error fetching investments' });
  }
});

module.exports = router;
