const express = require('express');
const router  = express.Router();
const { getAvailablePartners } = require('../services/partnerService');

// GET /api/partners/:city — Get available partners for a city
router.get('/partners/:city', async (req, res) => {
  try {
    const city     = req.params.city;
    const partners = await getAvailablePartners(city);
    res.json(partners);
  } catch (err) {
    console.error('[GET /partners/:city]', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;