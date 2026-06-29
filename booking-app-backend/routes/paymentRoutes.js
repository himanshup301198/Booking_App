const express = require('express');
const router  = express.Router();
const { handleWebhook } = require('../services/paymentService');

// POST /api/webhook/payment — Payment gateway webhook
router.post('/webhook/payment', async (req, res) => {
  try {
    const result = await handleWebhook(req.body);
    res.json(result);
  } catch (err) {
    console.error('[POST /webhook/payment]', err.message);
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;