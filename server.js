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
app.use(express.static('public'));

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

// Gallery images endpoint
app.get('/api/gallery', (req, res) => {
  const galleryImages = [
    {
      id: 1,
      name: 'Criss1',
      description: 'Description',
      imageUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=900',
      category: 'greens'
    },
    {
      id: 2,
      name: 'Another',
      description: 'Fresh botanical specimen',
      imageUrl: 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?auto=format&fit=crop&q=80&w=900',
      category: 'gallery'
    }
  ];
  res.json(galleryImages);
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
