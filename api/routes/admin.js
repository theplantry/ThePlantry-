import express from 'express';
import { pool } from '../../server.js';
import { verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all orders (admin)
router.get('/orders', verifyAdmin, async (req, res) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;
    let query = 'SELECT * FROM orders';
    const params = [];

    if (status) {
      query += ' WHERE status = $1';
      params.push(status);
    }

    query += ` ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`;

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get order details (admin)
router.get('/orders/:id', verifyAdmin, async (req, res) => {
  try {
    const orderResult = await pool.query(
      'SELECT * FROM orders WHERE id = $1',
      [req.params.id]
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

    const userResult = await pool.query(
      'SELECT id, email, full_name, phone FROM users WHERE id = $1',
      [orderResult.rows[0].user_id]
    );

    res.json({
      order: orderResult.rows[0],
      items: itemsResult.rows,
      payment: paymentResult.rows[0] || null,
      customer: userResult.rows[0] || null
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update order status
router.put('/orders/:id/status', verifyAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'placed', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const result = await pool.query(
      'UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [status, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add/Update product (admin)
router.post('/products', verifyAdmin, async (req, res) => {
  try {
    const { name, description, ingredients, price, category, image_url, stock } = req.body;

    if (!name || !price) {
      return res.status(400).json({ error: 'Name and price required' });
    }

    const result = await pool.query(
      `INSERT INTO products (name, description, ingredients, price, category, image_url, stock, available)
       VALUES ($1, $2, $3, $4, $5, $6, $7, true)
       RETURNING *`,
      [name, description, ingredients, price, category, image_url, stock || 0]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update product
router.put('/products/:id', verifyAdmin, async (req, res) => {
  try {
    const { name, description, ingredients, price, category, image_url, stock, available } = req.body;

    const result = await pool.query(
      `UPDATE products
       SET name = COALESCE($1, name),
           description = COALESCE($2, description),
           ingredients = COALESCE($3, ingredients),
           price = COALESCE($4, price),
           category = COALESCE($5, category),
           image_url = COALESCE($6, image_url),
           stock = COALESCE($7, stock),
           available = COALESCE($8, available),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $9
       RETURNING *`,
      [name, description, ingredients, price, category, image_url, stock, available, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get dashboard stats
router.get('/stats/dashboard', verifyAdmin, async (req, res) => {
  try {
    const ordersResult = await pool.query('SELECT COUNT(*) as total_orders FROM orders');
    const revenueResult = await pool.query('SELECT SUM(total_amount) as total_revenue FROM orders WHERE payment_status = $1', ['paid']);
    const productsResult = await pool.query('SELECT COUNT(*) as total_products FROM products');
    const usersResult = await pool.query('SELECT COUNT(*) as total_users FROM users');

    res.json({
      total_orders: parseInt(ordersResult.rows[0].total_orders),
      total_revenue: parseFloat(revenueResult.rows[0].total_revenue || 0),
      total_products: parseInt(productsResult.rows[0].total_products),
      total_users: parseInt(usersResult.rows[0].total_users)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
