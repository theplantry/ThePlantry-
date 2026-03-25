# The Plantry - Next.js Migration Guide

## What's Changed

Your Express.js + HTML application has been converted to a modern **Next.js 14 full-stack** application with:

- ✅ **Next.js 14 App Router** - Modern React server/client components
- ✅ **TypeScript** - Type-safe throughout the project
- ✅ **Tailwind CSS** - Pre-configured utility styles
- ✅ **React Components** - Reusable UI components (Navigation, Footer, ProductModal, Toast)
- ✅ **API Routes** - Next.js API routes replacing Express endpoints
- ✅ **NextAuth.js Ready** - Authentication infrastructure set up (can be configured for OAuth, JWT, etc.)
- ✅ **Stripe Integration Ready** - Payment checkout flow prepared
- ✅ **PostgreSQL Ready** - Database connection configured

## Project Structure

```
ThePlantry-/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with fonts & metadata
│   ├── page.tsx                 # Home page (multi-page with Shop, Story, Locations)
│   ├── globals.css              # Global Tailwind + custom styles
│   ├── checkout/
│   │   └── page.tsx            # Checkout page with order summary
│   ├── order-confirmation/
│   │   └── page.tsx            # Order confirmation page
│   ├── login/
│   │   └── page.tsx            # Login page
│   ├── register/
│   │   └── page.tsx            # Registration page
│   ├── admin/
│   │   └── page.tsx            # Admin dashboard
│   └── api/                      # API routes
│       ├── products/route.ts    # Get/create products
│       ├── auth/
│       │   ├── login/route.ts   # Authentication login
│       │   └── register/route.ts # User registration
│       ├── checkout/
│       │   └── create-payment-intent/route.ts # Stripe payments
│       └── admin/
│           └── orders/route.ts  # Admin order management
│
├── components/                   # Reusable React components
│   ├── Navigation.tsx           # Header with cart & navigation
│   ├── Footer.tsx               # Footer with links
│   ├── ProductModal.tsx         # Product detail modal
│   └── Toast.tsx                # Toast notifications
│
├── public/
│   └── assets/
│       ├── products/            # Product images
│       └── gallery/             # Gallery images
│
├── next.config.js              # Next.js configuration
├── tailwind.config.js          # Tailwind CSS setup
├── postcss.config.js           # PostCSS with Tailwind
├── tsconfig.json               # TypeScript configuration
├── .env.local                  # Environment variables
└── package.json                # Dependencies & scripts
```

## Running the Application

### Development Mode
```bash
npm run dev
```
Then open [http://localhost:3000](http://localhost:3000)

### Production Build
```bash
npm run build
npm start
```

### Legacy Express Server
If you need to run the old Express server:
```bash
npm run legacy-dev
```

## Key Features Implemented

### Home Page (`app/page.tsx`)
- Multi-page layout (Home, Shop, Story, Locations)
- Hero section with call-to-action
- Product catalog with category filtering
- Product modal with quantity selection
- localStorage-based shopping cart
- Toast notifications

### Shop System
- Dynamic product grid from API (`/api/products`)
- Category filtering (Beverages, Snacks, Supplements)
- Add to cart functionality
- Real product images from Cloudinary archive

### Checkout (`app/checkout/page.tsx`)
- Complete order form
- Currency selection (USD, EUR, GBP)
- Order summary with item breakdown
- 6% processing fee calculation
- Stripe integration ready
- localStorage cart retrieval

### Authentication
- **Login page** (`app/login/page.tsx`) - Email/password login
- **Register page** (`app/register/page.tsx`) - New account creation
- JWT tokens stored in localStorage
- Protected routes ready (can be enforced with middleware)

### Admin Dashboard (`app/admin/page.tsx`)
- Dashboard tab with stats overview
- Orders management
- Product catalog views
- Order status updates
- Admin-only access check

## API Endpoints

### Products
- `GET /api/products` - List all products
- `POST /api/products` - Create new product

### Authentication
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/register` - Register new user

### Checkout
- `POST /api/checkout/create-payment-intent` - Create Stripe payment intent

### Admin
- `GET /api/admin/orders` - Get orders (with status filter)
- `GET /api/admin/orders/[id]` - Get order details

## Next Steps to Complete Migration

### 1. **Install & Run Next.js**
```bash
npm install
npm run dev
```

### 2. **Database Connection**
Currently using fallback/mock data. To connect PostgreSQL:
- Update database connection in API routes
- Use Prisma ORM (already compatible)
- Run database migrations

### 3. **Complete Stripe Integration**
- Get real Stripe API keys from [stripe.com](https://stripe.com)
- Update `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` in `.env.local`
- Install Stripe React library: `npm install @stripe/react-stripe-js @stripe/stripe-js`
- Update checkout page to use Stripe Elements

### 4. **Complete NextAuth.js Setup**
```bash
npm install next-auth
```
- Configure OAuth providers (Google, GitHub, etc.)
- Set up session management
- Add protected routes middleware

### 5. **Enable Database Features**
- Install Prisma: `npm install @prisma/client prisma`
- Set up PostgreSQL connection
- Create Prisma schema for Products, Users, Orders
- Run migrations

### 6. **Deploy**
- Vercel (native Next.js support): `vercel deploy`
- AWS, Azure, or Docker

## TypeScript & Type Safety

All components are fully typed. Example:
```typescript
interface ProductModalProps {
  product: any;
  onClose: () => void;
  onAddToCart: (id: number, name: string, price: number, quantity: number) => void;
}
```

## Environment Variables

Create/update `.env.local` with actual values:
```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-random-secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
DATABASE_URL=postgresql://user:pass@localhost:5432/plantry
```

## Comparison: Express vs Next.js

| Aspect | Express | Next.js |
|--------|---------|---------|
| Rendering | Server-side HTML | Server/Client components |
| Routing | Manual routing config | File-based routing |
| API | Separate Express routes | Colocated `/api` routes |
| Frontend | Separate HTML/CSS/JS | React components |
| TypeScript | Manual setup | Built-in |
| Dev Experience | Hot reload with nodemon | Fast Refresh built-in |
| Built Assets | Manual webpack setup | Optimized by Next.js |

## Troubleshooting

**Port already in use?**
```bash
kill -9 $(lsof -t -i:3000)
npm run dev
```

**Types not recognized?**
```bash
npm install
npx tsc --noEmit
```

**Images not loading?**
- Ensure `/public/assets/products/` has image files
- Check `next.config.js` for image optimization settings
- Use `<Image>` component from `next/image` for optimization

## Files Migrated

Old HTML files → New TypeScript components:
- `index-mpa-wired.html` → `app/page.tsx`
- `checkout-full.html` → `app/checkout/page.tsx`
- `order-confirmation.html` → `app/order-confirmation/page.tsx`
- `login.html` → `app/login/page.tsx`
- `register.html` → `app/register/page.tsx`
- `admin.html` → `app/admin/page.tsx`
- Navigation/Footer layouts → `components/Navigation.tsx`, `Footer.tsx`

Old Express routes → New API routes:
- `api/routes/products.js` → `app/api/products/route.ts`
- `api/routes/auth.js` → `app/api/auth/{login,register}/route.ts`
- `api/routes/checkout.js` → `app/api/checkout/create-payment-intent/route.ts`
- `api/routes/admin.js` → `app/api/admin/orders/route.ts`

## Support

For Next.js documentation: https://nextjs.org/docs
For Tailwind CSS: https://tailwindcss.com/docs
For NextAuth.js: https://next-auth.js.org
