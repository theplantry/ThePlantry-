import { pool } from '../server.js';
import dotenv from 'dotenv';

dotenv.config();

const products = [
  {
    name: 'Morning Ritual Green',
    category: 'juices',
    price: 14.00,
    description: 'Fresh cold-pressed green juice with organic kale, cucumber, celery, and lemon',
    ingredients: 'Kale, Cucumber, Celery, Lemon',
    image_url: 'https://images.unsplash.com/photo-1610970881699-44a55869f9c2?auto=format&fit=crop&q=80&w=1000',
    stock: 40
  },
  {
    name: 'Ancient Grain Bowl',
    category: 'bowls',
    price: 22.00,
    description: 'Nourishing grain bowl with quinoa, roasted root vegetables, and tahini dressing',
    ingredients: 'Quinoa, Roasted Root Veg, Tahini',
    image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=1000',
    stock: 35
  },
  {
    name: 'Stone-Ground Almond Butter',
    category: 'pantry',
    price: 18.00,
    description: 'Organic almond butter ground in-house with just a touch of sea salt',
    ingredients: 'Organic Heirloom Almonds, Sea Salt',
    image_url: 'https://images.unsplash.com/photo-1544333346-61439281a8c0?auto=format&fit=crop&q=80&w=1000',
    stock: 50
  },
  {
    name: 'Sunrise Turmeric Latte',
    category: 'juices',
    price: 12.00,
    description: 'Golden milk made with organic turmeric, ginger, coconut milk, and warming spices',
    ingredients: 'Turmeric, Ginger, Coconut Milk, Cinnamon',
    image_url: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&q=80&w=1000',
    stock: 45
  },
  {
    name: 'Buddha Blessing Bowl',
    category: 'bowls',
    price: 24.00,
    description: 'Superfood packed bowl with organic grains, roasted vegetables, seed medley, and tahini',
    ingredients: 'Millet, Roasted Vegetables, Seeds, Tahini',
    image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600',
    stock: 30
  },
  {
    name: 'Cold Brew Coffee',
    category: 'juices',
    price: 6.00,
    description: 'Small batch cold brew made from shade-grown, single-origin beans',
    ingredients: 'Organic Cold Brew Coffee',
    image_url: 'https://images.unsplash.com/photo-1514432324607-2e467f4af445?auto=format&fit=crop&q=80&w=1000',
    stock: 60
  },
  {
    name: 'Organic Granola Blend',
    category: 'pantry',
    price: 16.00,
    description: 'House-made granola with organic oats, nuts, seeds, and dried fruit',
    ingredients: 'Organic Oats, Almonds, Walnuts, Dried Coconut, Maple Syrup',
    image_url: 'https://images.unsplash.com/photo-1517668808822-9ebb02ae2a0e?auto=format&fit=crop&q=80&w=1000',
    stock: 55
  }
];

const locations = [
  {
    name: 'Downtown Location',
    address: '123 Green Street',
    city: 'San Francisco',
    postal_code: '94102',
    phone: '(415) 555-0100',
    hours: 'Mon-Sun 7am-7pm',
    latitude: 37.7749,
    longitude: -122.4194
  },
  {
    name: 'Marina District',
    address: '456 Plant Avenue',
    city: 'San Francisco',
    postal_code: '94123',
    phone: '(415) 555-0101',
    hours: 'Mon-Sun 7am-7pm',
    latitude: 37.8044,
    longitude: -122.4370
  }
];

async function seedDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('🌱 Beginning database seed...');
    
    // Clear existing data
    await client.query('DELETE FROM delivery_schedule');
    await client.query('DELETE FROM locations');
    await client.query('DELETE FROM products');
    await client.query('DELETE FROM payments');
    await client.query('DELETE FROM order_items');
    await client.query('DELETE FROM orders');
    await client.query('DELETE FROM cart_items');
    
    // Seed products
    console.log('📦 Adding products...');
    for (const product of products) {
      await client.query(
        `INSERT INTO products (name, category, price, description, ingredients, image_url, stock, available)
         VALUES ($1, $2, $3, $4, $5, $6, $7, true)`,
        [product.name, product.category, product.price, product.description, product.ingredients, product.image_url, product.stock]
      );
    }
    console.log(`✓ Added ${products.length} products`);

    // Seed locations
    console.log('📍 Adding locations...');
    for (const location of locations) {
      await client.query(
        `INSERT INTO locations (name, address, city, postal_code, phone, hours, latitude, longitude)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [location.name, location.address, location.city, location.postal_code, location.phone, location.hours, location.latitude, location.longitude]
      );
    }
    console.log(`✓ Added ${locations.length} locations`);

    // Seed delivery schedule
    console.log('📅 Adding delivery schedule...');
    const locationResult = await client.query('SELECT id FROM locations');
    for (const location of locationResult.rows) {
      await client.query(
        `INSERT INTO delivery_schedule (location_id, day_of_week, delivery_time)
         VALUES ($1, $2, $3)`,
        [location.id, 'Tuesday', '10:00 AM']
      );
      await client.query(
        `INSERT INTO delivery_schedule (location_id, day_of_week, delivery_time)
         VALUES ($1, $2, $3)`,
        [location.id, 'Friday', '10:00 AM']
      );
    }
    console.log('✓ Added delivery schedule');

    console.log('✅ Database seeding complete!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

seedDatabase();
