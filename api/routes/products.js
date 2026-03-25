import express from 'express';
import { pool } from '../../server.js';

const router = express.Router();

const fallbackProducts = [
  { id: 1, name: 'Dreamwell Nightcap', description: 'Calming nighttime elixir for restorative sleep', ingredients: 'Passionflower, valerian, chamomile, lavender', image_url: '/assets/products/dreamwell-nightcap.jpg', price: 1800, category: 'wellness', available: true },
  { id: 2, name: 'Harmony Hearty Brew', description: 'Warming herbal blend for balance and energy', ingredients: 'Ginger, turmeric, cinnamon, honey', image_url: '/assets/products/harmony-hearty-brew.jpg', price: 2200, category: 'wellness', available: true },
  { id: 3, name: 'Power Pulse Bar', description: 'Energy-packed superfood bar', ingredients: 'Raw cacao, goji berries, hemp seeds, coconut', image_url: '/assets/products/power-pulse-bar.jpg', price: 1500, category: 'snacks', available: true },
  { id: 4, name: 'Rise & Nourish Bowl', description: 'Nutrient-dense breakfast bowl', ingredients: 'Quinoa, berries, nuts, coconut yogurt', image_url: '/assets/products/rise-nourish-bowl.jpg', price: 2800, category: 'meals', available: true },
  { id: 5, name: 'Vital Spark Elixir', description: 'Immunity-boosting tonic', ingredients: 'Turmeric, ginger, black pepper, coconut milk', image_url: '/assets/products/vital-spark-elixir.jpg', price: 2500, category: 'wellness', available: true },
  { id: 6, name: 'Wellness Wave', description: 'Refreshing detox juice blend', ingredients: 'Apple, celery, ginger, lemon, spinach', image_url: '/assets/products/wellness-wave.jpg', price: 1900, category: 'juices', available: true },
];

function filterFallbackProducts(category) {
  if (!category || category === 'all') return fallbackProducts;
  return fallbackProducts.filter(p => p.category === category.toLowerCase());
}

// Get all products
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    let query = 'SELECT * FROM products WHERE available = true';
    const params = [];

    if (category) {
      query += ' AND category = $1';
      params.push(category);
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Products GET / api error:', error);
    if (error.code === 'ECONNREFUSED' || (error.errors && error.errors[0] && error.errors[0].code === 'ECONNREFUSED')) {
      const { category } = req.query;
      return res.json(filterFallbackProducts(category));
    }
    res.status(500).json({ error: error.message || 'Unable to fetch products' });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Products GET /:id api error:', error);
    if (error.code === 'ECONNREFUSED' || (error.errors && error.errors[0] && error.errors[0].code === 'ECONNREFUSED')) {
      const fallback = fallbackProducts.find(p => p.id === parseInt(req.params.id, 10));
      if (!fallback) return res.status(404).json({ error: 'Product not found' });
      return res.json(fallback);
    }
    res.status(500).json({ error: error.message || 'Unable to fetch product' });
  }
});

// Get categories
router.get('/categories/all', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT DISTINCT category FROM products WHERE category IS NOT NULL ORDER BY category'
    );
    const categories = result.rows.map(row => row.category);
    res.json(categories);
  } catch (error) {
    console.error('Products GET /categories/all api error:', error);
    if (error.code === 'ECONNREFUSED' || (error.errors && error.errors[0] && error.errors[0].code === 'ECONNREFUSED')) {
      const categories = [...new Set(fallbackProducts.map(p => p.category))];
      return res.json(categories);
    }
    res.status(500).json({ error: error.message || 'Unable to fetch categories' });
  }
});

export default router;
