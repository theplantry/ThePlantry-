import express from 'express';
import { pool } from '../../server.js';

const router = express.Router();

const fallbackProducts = [
  { id: 1, name: 'June Plum Juice', description: 'Cold-pressed gem', ingredients: 'Juniper plum, ginger, turmeric', image_url: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=900', price: 1200, category: 'juices', available: true },
  { id: 2, name: 'Ital Harvest Bowl', description: 'Hearty bowl', ingredients: 'Callaloo, quinoa, squash', image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=900', price: 2500, category: 'meals', available: true },
  { id: 3, name: 'Blue Mountain Grounds', description: 'Small-batch roast', ingredients: 'Arabica beans', image_url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=900', price: 4800, category: 'pantry', available: true },
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
