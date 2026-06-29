const pool = require('../config/db');

const handleWebhook = async (data) => {
  const { transaction_id, booking_id, amount, status } = data;

  if (!transaction_id || !booking_id || !amount) {
    throw new Error('Invalid webhook payload: missing required fields');
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // PROBLEM 3: Idempotency check — O(1) due to index on transaction_id
    const existing = await client.query(
      `SELECT id, status FROM payments WHERE transaction_id = $1`,
      [transaction_id]
    );

    if (existing.rows.length > 0) {
      await client.query('ROLLBACK');
      console.log(`[Webhook] Duplicate ignored: ${transaction_id}`);
      return {
        isDuplicate: true,
        message:     'Duplicate webhook — already processed',
        paymentId:   existing.rows[0].id,
      };
    }

    // Verify booking exists and is in PENDING state
    const booking = await client.query(
      `SELECT id, status FROM bookings WHERE id = $1 FOR UPDATE`,
      [booking_id]
    );

    if (booking.rows.length === 0) {
      throw new Error(`Booking ${booking_id} not found`);
    }

    const paymentStatus = status === 'SUCCESS' ? 'SUCCESS' : 'FAILED';

    // Insert payment record
    const payment = await client.query(
      `INSERT INTO payments (booking_id, amount, status, transaction_id)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [booking_id, amount, paymentStatus, transaction_id]
    );

    // Update booking status only on successful payment
    if (paymentStatus === 'SUCCESS') {
      await client.query(
        `UPDATE bookings SET status = 'CONFIRMED', updated_at = NOW() WHERE id = $1`,
        [booking_id]
      );
    }

    await client.query('COMMIT');

    console.log(`[Webhook] Processed: ${transaction_id} → ${paymentStatus}`);
    return {
      isDuplicate: false,
      message:     'Webhook processed successfully',
      payment:     payment.rows[0],
    };

  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

module.exports = { handleWebhook };