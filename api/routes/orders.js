import express from 'express';
import { pool } from '../../server.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Create order from cart
router.post('/create', verifyToken, async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const { shipping_address, billing_address, notes } = req.body;

    // Get user's cart
    const cartResult = await client.query(
      `SELECT ci.*, p.price FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.user_id = $1`,
      [req.user.id]
    );

    if (cartResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Calculate total
    const total = cartResult.rows.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${req.user.id}`;

    // Create order
    const orderResult = await client.query(
      `INSERT INTO orders (user_id, order_number, total_amount, shipping_address, billing_address, notes, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'placed')
       RETURNING *`,
      [req.user.id, orderNumber, total, shipping_address, billing_address, notes || '']
    );

    const order = orderResult.rows[0];

    // Create order items
    for (const item of cartResult.rows) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase)
         VALUES ($1, $2, $3, $4)`,
        [order.id, item.product_id, item.quantity, item.price]
      );
    }

    // Clear cart
    await client.query('DELETE FROM cart_items WHERE user_id = $1', [req.user.id]);

    await client.query('COMMIT');

    res.status(201).json({
      order,
      message: 'Order created successfully'
    });
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
});

// Get user orders
router.get('/', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC`,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single order
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const orderResult = await pool.query(
      'SELECT * FROM orders WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const itemsResult = await pool.query(
      `SELECT oi.*, p.name, p.category FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = $1`,
      [req.params.id]
    );

    const paymentResult = await pool.query(
      'SELECT * FROM payments WHERE order_id = $1',
      [req.params.id]
    );

    res.json({
      order: orderResult.rows[0],
      items: itemsResult.rows,
      payment: paymentResult.rows[0] || null
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
