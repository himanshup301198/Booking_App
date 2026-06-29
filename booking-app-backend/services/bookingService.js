const pool                                   = require('../config/db');
const { selectBestPartner, invalidatePartnerCache } = require('./partnerService');

const createBooking = async (userId, city, slotTime) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // PROBLEM 2: Pick best partner (lowest workload, same city)
    const partner = await selectBestPartner(client, city);

    // PROBLEM 1: Verify the slot is free for this partner
    const slotCheck = await client.query(
      `SELECT id FROM bookings
       WHERE  partner_id = $1 AND slot_time = $2 AND status != 'CANCELLED'`,
      [partner.id, slotTime]
    );

    if (slotCheck.rows.length > 0) {
      throw new Error('This time slot is already booked for the selected partner');
    }

    // Insert booking
    const booking = await client.query(
      `INSERT INTO bookings (user_id, partner_id, slot_time, status)
       VALUES ($1, $2, $3, 'PENDING')
       RETURNING *`,
      [userId, partner.id, slotTime]
    );

    // Increment partner's active bookings counter
    await client.query(
      `UPDATE partners SET active_bookings = active_bookings + 1 WHERE id = $1`,
      [partner.id]
    );

    await client.query('COMMIT');

    // PROBLEM 5: Invalidate partner cache after booking
    await invalidatePartnerCache(city);

    return {
      ...booking.rows[0],
      partner_name: partner.name,
    };

  } catch (err) {
    await client.query('ROLLBACK');
    // Re-throw with cleaner message for UNIQUE constraint violation
    if (err.code === '23505') {
      throw new Error('This time slot is already booked. Please choose a different time.');
    }
    throw err;
  } finally {
    client.release();
  }
};

const cancelBooking = async (bookingId) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const bookingResult = await client.query(
      `SELECT b.*, p.city
       FROM   bookings b
       JOIN   partners p  ON p.id = b.partner_id
       WHERE  b.id = $1
       FOR UPDATE OF b`,
      [bookingId]
    );

    const paymentResult = await client.query(
      `SELECT id, amount FROM payments 
       WHERE booking_id = $1 AND status = 'SUCCESS'
       LIMIT 1`,
      [bookingId]
    );

    const booking = {
      ...bookingResult.rows[0],
      paid_amount: paymentResult.rows[0]?.amount || 0,
      payment_id:  paymentResult.rows[0]?.id || null,
    };

    if (bookingResult.rows.length === 0) {
      throw new Error('Booking not found');
    }


    if (booking.status === 'CANCELLED') {
      throw new Error('Booking is already cancelled');
    }

    // Refund logic
    let refundAmount = 0;
    let refundNote   = '';

    if (booking.status === 'PENDING') {
      refundAmount = booking.paid_amount || 0;
      refundNote   = 'Full refund — booking was pending';
    } else if (booking.status === 'CONFIRMED') {
      refundAmount = booking.paid_amount ? Math.floor(booking.paid_amount * 0.5) : 0;
      refundNote   = 'Partial refund (50%) — booking was confirmed';
    }

    // Booking cancel
    await client.query(
      `UPDATE bookings SET status = 'CANCELLED' WHERE id = $1`,
      [bookingId]
    );

    // Payment refund if user exist karta hai
    if (booking.payment_id) {
      await client.query(
        `UPDATE payments
         SET    status = 'REFUNDED', refund_amount = $1, updated_at = NOW()
         WHERE  id = $2`,
        [refundAmount, booking.payment_id]
      );
    }

    // Partner ka active_bookings kam
    await client.query(
      `UPDATE partners
       SET    active_bookings = GREATEST(active_bookings - 1, 0)
       WHERE  id = $1`,
      [booking.partner_id]
    );

    await client.query('COMMIT');

    await invalidatePartnerCache(booking.city);

    return {
      bookingId,
      status:       'CANCELLED',
      refundAmount,
      refundNote,
    };

  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

/**
 * Get a single booking with partner and payment details.
 */
const getBookingById = async (bookingId) => {
  const result = await pool.query(
    `SELECT b.*, p.name AS partner_name, p.city,
            pay.amount, pay.status AS payment_status, pay.transaction_id
     FROM   bookings b
     JOIN   partners p   ON p.id  = b.partner_id
     LEFT JOIN payments pay ON pay.booking_id = b.id
     WHERE  b.id = $1`,
    [bookingId]
  );

  if (result.rows.length === 0) throw new Error('Booking not found');
  return result.rows[0];
};

module.exports = { createBooking, cancelBooking, getBookingById };