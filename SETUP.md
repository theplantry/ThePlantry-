# The Plantry - Setup & Deployment Guide

## Quick Start

### 1. Environment Setup

```bash
# Copy example env file
cp .env.example .env

# Edit with your values
nano .env
```

### 2. Database Setup

For development on Mac/Linux:
```bash
# Install PostgreSQL if not present
# macOS: brew install postgresql@15
# Ubuntu: sudo apt-get install postgresql postgresql-contrib

# Create database and user
sudo -u postgres psql
postgres=# CREATE DATABASE plantry;
postgres=# CREATE USER plantry_user WITH PASSWORD 'your_password';
postgres=# GRANT ALL PRIVILEGES ON DATABASE plantry TO plantry_user;
postgres=# \q

# Initialize schema
psql -U plantry_user -d plantry < database/schema.sql

# Seed sample data
npm run seed
```

### 3. Dependencies & Start

```bash
npm install
npm run dev
```

Visit: http://localhost:5000

---

## Production Deployment

### Option A: Heroku

```bash
# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Add PostgreSQL
heroku addons:create heroku-postgresql:standard-0

# Set environment variables
heroku config:set JWT_SECRET="your-secure-key"
heroku config:set STRIPE_SECRET_KEY="sk_live_xxx"
heroku config:set STRIPE_PUBLIC_KEY="pk_live_xxx"

# Deploy
git push heroku main

# Run migrations
heroku run npm run seed
```

### Option B: DigitalOcean App Platform

1. Connect GitHub repo
2. Set environment variables
3. Configure database (DigitalOcean PostgreSQL)
4. Deploy

### Option C: AWS EC2

1. Launch Ubuntu instance
2. Install Node.js and PostgreSQL
3. Clone repository
4. Configure environment
5. Use PM2 for process management:
```bash
npm install -g pm2
pm2 start server.js --name "plantry"
pm2 startup
pm2 save
```

---

## Testing the API

### 1. Register & Login

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "full_name": "Test User"
  }'

# Response includes token
# Save the token for next requests
TOKEN="your_token_here"

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 2. Get Products

```bash
curl http://localhost:5000/api/products
```

### 3. Add to Cart

```bash
curl -X POST http://localhost:5000/api/cart/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "product_id": 1,
    "quantity": 2
  }'
```

### 4. Create Order

```bash
curl -X POST http://localhost:5000/api/orders/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "shipping_address": "123 Main St, City, ST 12345",
    "billing_address": "123 Main St, City, ST 12345",
    "notes": "Please leave at door"
  }'
```

---

## Stripe Configuration

### Test Mode Setup

1. Go to https://dashboard.stripe.com/apikeys
2. Copy test keys
3. Add to .env:
   ```
   STRIPE_SECRET_KEY=sk_test_xxxxx
   STRIPE_PUBLIC_KEY=pk_test_xxxxx
   ```

### Live Mode Setup

1. Complete Stripe account verification
2. Get live keys from dashboard
3. Update .env with live keys
4. Update STRIPE_KEY in public/checkout.html

### Test Card Numbers

- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Auth Required: `4000 0025 0000 0003`

---

## Admin User Setup

Currently, admin status is determined by manually setting `role` in the database:

```sql
UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';
```

To set up an admin user:

1. Register a new user through the frontend
2. In database, update their role:
   ```bash
   psql -U plantry_user -d plantry
   plantry=# UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';
   ```
3. Admin endpoints are now accessible with their JWT token

---

## Monitoring & Logging

### View Logs

Local development:
- Check terminal where `npm run dev` is running
- Logs include all API requests and errors

Production (Heroku):
```bash
heroku logs --tail
```

### Database Inspection

```bash
# Connect to PostgreSQL
psql -U plantry_user -d plantry

# List tables
\dt

# View orders
SELECT * FROM orders;

# View users
SELECT id, email, full_name FROM users;

# Check order details
SELECT * FROM order_items WHERE order_id = 1;
```

---

## Troubleshooting

### Database Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

Solutions:
- Verify PostgreSQL is running: `brew services list` (Mac)
- Check connection string in .env
- Verify database exists: `psql -l | grep plantry`

### Port Already in Use

```
Error: listen EADDRINUSE: address already in use :::5000
```

Solution:
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>
```

### Stripe Key Invalid

Error when calling payment endpoints

Solution:
- Verify STRIPE_SECRET_KEY in .env matches your account
- Ensure key starts with `sk_test_` or `sk_live_`
- Clear browser cache and restart server

### CORS Error

Frontend can't reach API

Solution:
- Verify CORS is enabled in server.js
- Check that frontend URL matches `origin` in CORS config
- For local testing, CORS should allow `http://localhost:5000`

---

## Performance Optimization

### Database Indexes

Main indexes are created in `database/schema.sql`. For additional queries:

```sql
-- Add custom indexes as needed
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_payments_status ON payments(status);
```

### Caching

To add Redis caching for products:

```bash
npm install redis
```

Then implement in routes:
```javascript
const redis = require('redis');
const client = redis.createClient();

// Cache product list for 1 hour
await client.setex('products', 3600, JSON.stringify(products));
```

---

## Security Checklist

- [ ] Change JWT_SECRET to a strong random value
- [ ] Use HTTPS in production
- [ ] Keep dependencies updated: `npm audit fix`
- [ ] Set DATABASE_URL to use SSL in production
- [ ] Remove `.env` from version control (use `.gitignore`)
- [ ] Enable CORS only for your domain in production
- [ ] Set secure Stripe keys (switch to live keys)
- [ ] Configure email service for order notifications
- [ ] Regular database backups (Heroku or manual)
- [ ] Monitor logs for suspicious activity

---

## Maintenance

### Regular Tasks

- Weekly: Check error logs for issues
- Monthly: Update dependencies with `npm update`
- Quarterly: Audit security with `npm audit`
- Quarterly: Backup database
- Quarterly: Review Stripe transactions

### Database Maintenance

```bash
# Backup database to file
pg_dump -U plantry_user plantry > backup.sql

# Restore from backup
psql -U plantry_user plantry < backup.sql

# Cleanup old data (example)
DELETE FROM payments WHERE created_at < NOW() - INTERVAL '6 months';
```

---

## Support & Issues

For issues or questions:
1. Check error logs in terminal/Heroku
2. Review troubleshooting section above
3. Check database schema matches code expectations
4. Verify all environment variables are set
5. Test API endpoints with curl (examples above)

