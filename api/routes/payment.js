import express from 'express';
import { pool } from '../../server.js';
import { verifyToken } from '../middleware/auth.js';
import Stripe from 'stripe';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create payment intent
router.post('/create-intent', verifyToken, async (req, res) => {
  try {
    const { order_id } = req.body;

    // Verify order belongs to user
    const orderResult = await pool.query(
      'SELECT * FROM orders WHERE id = $1 AND user_id = $2',
      [order_id, req.user.id]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = orderResult.rows[0];

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.total_amount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        order_id: order.id,
        user_id: req.user.id
      }
    });

    res.json({
      client_secret: paymentIntent.client_secret,
      payment_intent_id: paymentIntent.id
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Confirm payment
router.post('/confirm', verifyToken, async (req, res) => {
  try {
    const { order_id, stripe_charge_id } = req.body;

    const paymentResult = await pool.query(
      `INSERT INTO payments (order_id, stripe_charge_id, amount, status, payment_method)
       SELECT id, $2, total_amount, 'completed', 'stripe'
       FROM orders
       WHERE id = $1 AND user_id = $3
       RETURNING *`,
      [order_id, stripe_charge_id, req.user.id]
    );

    if (paymentResult.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Update order status
    await pool.query(
      'UPDATE orders SET payment_status = $1, status = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3',
      ['paid', 'confirmed', order_id]
    );

    res.json({
      payment: paymentResult.rows[0],
      message: 'Payment confirmed'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get payment for order
router.get('/:order_id', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.* FROM payments p
       JOIN orders o ON p.order_id = o.id
       WHERE p.order_id = $1 AND o.user_id = $2`,
      [req.params.order_id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
