# The Plantry - Deployment Checklist & Guide

## ✅ Setup Completed
- [x] Environment variables configured (.env file created)
- [x] API routes verified and working
- [x] Server.js configured for both local and serverless environments
- [x] Database schema ready (see database/schema.sql)
- [x] All dependencies installed

---

## 🚀 Production Deployment Steps

### Step 1: Configure Database (Choose One Option)

#### Option A: Vercel Postgres (Recommended for Vercel)
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Add Postgres
vercel env add DATABASE_URL
# Paste your Vercel Postgres connection string
```

#### Option B: Supabase (PostgreSQL SaaS)
1. Create account at https://supabase.com
2. Create new project
3. Go to Settings > Database > Connection string
4. Copy the connection string
5. Set as DATABASE_URL env var in Vercel

#### Option C: DigitalOcean App Platform
1. Create managed PostgreSQL database
2. Get connection string from cluster settings

---

### Step 2: Set Environment Variables in Vercel

Using Vercel CLI:
```bash
vercel env add JWT_SECRET "your-super-secret-key-here"
vercel env add STRIPE_SECRET_KEY "sk_live_xxx"
vercel env add STRIPE_PUBLIC_KEY "pk_live_xxx"
vercel env add DATABASE_URL "postgresql://user:password@host:5432/plantry"
```

Or via Vercel Dashboard:
1. Go to Project Settings
2. Environment Variables
3. Add each variable for production, preview, and development

---

### Step 3: Deploy to Vercel

```bash
# Push to GitHub (if not already done)
git add .
git commit -m "Setup complete - ready for production"
git push origin main

# Deploy (auto-triggers on push if Vercel is connected)
# OR manually deploy:
vercel --prod
```

---

### Step 4: Initialize Database Schema

After deployment, run migrations to create tables:

```bash
# Get your Vercel function URL
VERCEL_URL=$(vercel ls | grep "the-plantry" | awk '{print $1}')

# Or from Vercel Dashboard -> Deployments -> your domain

# Option A: Run seed script locally (if connected to production DB)
npm run seed

# Option B: Use a Vercel function to initialize (advanced)
```

---

## 📊 Post-Deployment Checklist

### Test API Endpoints
```bash
# Health check
curl https://your-plantry-domain.vercel.app/health

# Get products
curl https://your-plantry-domain.vercel.app/api/products

# Test auth
curl -X POST https://your-plantry-domain.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "test123", "full_name": "Test User"}'
```

### Monitor Logs
- Vercel Dashboard > Deployments > Function Logs
- View real-time errors and performance

### Monitor Database
- Database provider logs/dashboard
- Check connection status
- Monitor query performance

---

## 🔒 Security Checklist

- [ ] JWT_SECRET is strong (min 32 characters)
- [ ] Database password is strong
- [ ] Stripe keys are production keys (sk_live_*, pk_live_*)
- [ ] CORS is properly configured
- [ ] No sensitive data in git history
- [ ] Environment variables are not committed
- [ ] HTTPS is enabled (Vercel default)
- [ ] Rate limiting configured (recommended)

---

## 🎯 Next Steps

1. **Connect Custom Domain**
   - Vercel Dashboard > Settings > Domains
   - Add your theplantry.com domain

2. **Set Up Email Notifications**
   - Configure order confirmation emails
   - Setup password reset emails

3. **Configure Stripe Webhooks**
   - Add webhook endpoint in Stripe Dashboard
   - Point to: `https://your-domain/api/payment/webhook`

4. **Monitor Analytics**
   - Setup Google Analytics
   - Monitor Vercel analytics
   - Track user behavior

5. **Scale if Needed**
   - Database optimization
   - CDN for static assets
   - Caching strategies

---

**Deployed on**: March 19, 2026
**Status**: ✅ Ready for Production
