import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Pool } from 'pg';

// Load environment variables
dotenv.config();

// __dirname workaround for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// export the express app for serverless environments (Vercel, etc.)
const PORT = process.env.PORT || 5000;

// Serve new multi-page index file at root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index-mpa.html'));
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// static assets (after root override)
app.use(express.static(path.join(__dirname, 'public')));

// Serve Cloudinary archive images
app.use('/images', express.static(path.join(__dirname, 'Cloudinary_Archive_2026-03-18_20_32_30_Originals')));

// Database connection
export const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'plantry',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

pool.on('error', (err) => {
  console.error('Unexpected pool error:', err);
});

// Import routes
import authRoutes from './api/routes/auth.js';
import productRoutes from './api/routes/products.js';
import orderRoutes from './api/routes/orders.js';
import cartRoutes from './api/routes/cart.js';
import paymentRoutes from './api/routes/payment.js';
import adminRoutes from './api/routes/admin.js';
import cloudinaryRoutes from './api/routes/cloudinary.js';

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/cloudinary', cloudinaryRoutes);

// Featured products endpoint with local images
app.get('/api/featured-products', (req, res) => {
  const products = [
    {
      id: 1,
      name: 'Criss1',
      description: 'Premium organic botanical selection',
      price: 24.99,
      imageUrl: '/images/PLANTRY%20x%20Wendell/Criss1',
      category: 'greens'
    },
    {
      id: 2,
      name: 'Another',
      description: 'Fresh botanical specimen',
      price: 19.99,
      imageUrl: '/images/PLANTRY%20x%20Wendell/Another',
      category: 'bowls'
    }
  ];
  res.json(products);
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'The Plantry is thriving!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

// In a serverless environment (Vercel) `process.env.VERCEL` is defined.
// Avoid calling listen there; export the app so the platform can use it.
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🌱 The Plantry server is growing on port ${PORT}`);
  });
}

export default app;
