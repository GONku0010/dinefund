const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../config/database');
const { auth, requireRole } = require('../middleware/auth');

const router = express.Router();

// Create investment (investors only)
router.post('/', [
  auth,
  requireRole('investor'),
  body('campaign_id').isUUID(),
  body('amount').isFloat({ min: 1 })
], async (req, res) => {
  const client = await pool.connect();
  
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { campaign_id, amount } = req.body;

    await client.query('BEGIN');

    // Get campaign details
    const campaign = await client.query(
      'SELECT id, funding_goal, current_funding, status FROM campaigns WHERE id = $1',
      [campaign_id]
    );

    if (campaign.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Campaign not found' });
    }

    const campaignData = campaign.rows[0];

    if (campaignData.status !== 'active') {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Campaign is not active' });
    }

    // Check if investment would exceed funding goal
    const newTotal = parseFloat(campaignData.current_funding) + parseFloat(amount);
    if (newTotal > parseFloat(campaignData.funding_goal)) {
      await client.query('ROLLBACK');
      return res.status(400).json({ 
        error: 'Investment amount exceeds remaining funding needed',
        remaining: parseFloat(campaignData.funding_goal) - parseFloat(campaignData.current_funding)
      });
    }

    // Create investment
    const investment = await client.query(
      `INSERT INTO investments (campaign_id, investor_id, amount, status)
       VALUES ($1, $2, $3, 'completed')
       RETURNING *`,
      [campaign_id, req.user.id, amount]
    );

    // Update campaign current_funding
    await client.query(
      `UPDATE campaigns 
       SET current_funding = current_funding + $1,
           status = CASE 
             WHEN current_funding + $1 >= funding_goal THEN 'funded'::campaign_status
             ELSE status
           END,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $2`,
      [amount, campaign_id]
    );

    await client.query('COMMIT');

    res.status(201).json({
      message: 'Investment created successfully',
      investment: investment.rows[0]
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Create investment error:', error);
    res.status(500).json({ error: 'Server error creating investment' });
  } finally {
    client.release();
  }
});

// Get user's investments
router.get('/my-investments', auth, requireRole('investor'), async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT i.*,
             c.title as campaign_title,
             c.funding_goal,
             c.current_funding,
             c.interest_rate,
             c.duration_months,
             c.status as campaign_status,
             r.name as restaurant_name,
             r.cuisine_type,
             r.location,
             r.image_url as restaurant_image
       FROM investments i
       JOIN campaigns c ON i.campaign_id = c.id
       JOIN restaurants r ON c.restaurant_id = r.id
       WHERE i.investor_id = $1
       ORDER BY i.investment_date DESC`,
      [req.user.id]
    );

    // Calculate total invested and potential returns
    const summary = await pool.query(
      `SELECT 
         COUNT(*) as total_investments,
         COALESCE(SUM(amount), 0) as total_invested,
         COALESCE(SUM(amount * (1 + c.interest_rate / 100)), 0) as potential_returns
       FROM investments i
       JOIN campaigns c ON i.campaign_id = c.id
       WHERE i.investor_id = $1 AND i.status = 'completed'`,
      [req.user.id]
    );

    res.json({
      investments: result.rows,
      summary: summary.rows[0]
    });
  } catch (error) {
    console.error('Get my investments error:', error);
    res.status(500).json({ error: 'Server error fetching investments' });
  }
});

// Get investment statistics for investor dashboard
router.get('/stats', auth, requireRole('investor'), async (req, res) => {
  try {
    const stats = await pool.query(
      `SELECT 
         COUNT(DISTINCT i.campaign_id) as campaigns_invested,
         COUNT(*) as total_investments,
         COALESCE(SUM(i.amount), 0) as total_invested,
         COALESCE(AVG(c.interest_rate), 0) as avg_interest_rate,
         COUNT(CASE WHEN c.status = 'funded' THEN 1 END) as successful_campaigns,
         COUNT(CASE WHEN c.status = 'active' THEN 1 END) as active_campaigns
       FROM investments i
       JOIN campaigns c ON i.campaign_id = c.id
       WHERE i.investor_id = $1 AND i.status = 'completed'`,
      [req.user.id]
    );

    res.json({ stats: stats.rows[0] });
  } catch (error) {
    console.error('Get investment stats error:', error);
    res.status(500).json({ error: 'Server error fetching statistics' });
  }
});

module.exports = router;
