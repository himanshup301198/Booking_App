const express = require('express');
const router  = express.Router();
const {
  createBooking,
  cancelBooking,
  getBookingById,
} = require('../services/bookingService');

// POST /api/book — Create a booking
router.post('/book', async (req, res) => {
  try {
    const { userId, city, slotTime } = req.body;

    if (!userId || !city || !slotTime) {
      return res.status(400).json({ error: 'userId, city, and slotTime are required' });
    }

    const booking = await createBooking(userId, city, slotTime);
    res.status(201).json(booking);
  } catch (err) {
    console.error('[POST /book]', err.message);
    res.status(400).json({ error: err.message });
  }
});

// POST /api/cancel — Cancel a booking
router.post('/cancel', async (req, res) => {
  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({ error: 'bookingId is required' });
    }

    const result = await cancelBooking(bookingId);
    res.json(result);
  } catch (err) {
    console.error('[POST /cancel]', err.message);
    res.status(400).json({ error: err.message });
  }
});

// GET /api/booking/:id — Get booking details
router.get('/booking/:id', async (req, res) => {
  try {
    const booking = await getBookingById(req.params.id);
    res.json(booking);
  } catch (err) {
    console.error('[GET /booking/:id]', err.message);
    res.status(404).json({ error: err.message });
  }
});

module.exports = router;