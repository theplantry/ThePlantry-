# The Plantry - API Routes Reference

Base URL: `http://localhost:5000/api` or `https://your-plantry-domain.com/api`

## Authentication Routes

### Register a New User
- **Endpoint**: `POST /auth/register`
- **Auth Required**: No
- **Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "full_name": "John Doe"
}
```
- **Response**:
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "full_name": "John Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Login
- **Endpoint**: `POST /auth/login`
- **Auth Required**: No
- **Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```
- **Response**: Same as register

---

## Product Routes

### Get All Products
- **Endpoint**: `GET /products`
- **Auth Required**: No
- **Query Parameters**:
  - `category` (optional): Filter by category (e.g., "juices", "bowls", "pantry")
- **Example**: `GET /products?category=juices`
- **Response**:
```json
[
  {
    "id": 1,
    "name": "Morning Ritual Green",
    "category": "juices",
    "price": 14.00,
    "description": "Fresh cold-pressed green juice...",
    "ingredients": "Kale, Cucumber, Celery, Lemon",
    "image_url": "https://...",
    "stock": 40,
    "available": true,
    "created_at": "2024-02-27T10:00:00Z"
  }
]
```

### Get Single Product
- **Endpoint**: `GET /products/{id}`
- **Auth Required**: No
- **Response**: Single product object (same structure as above)

### Get All Categories
- **Endpoint**: `GET /products/categories/all`
- **Auth Required**: No
- **Response**:
```json
["juices", "bowls", "pantry"]
```

---

## Cart Routes

> ⚠️ All cart routes require authentication. Include `Authorization: Bearer {token}` header

### Get Cart
- **Endpoint**: `GET /cart`
- **Auth Required**: Yes
- **Response**:
```json
{
  "items": [
    {
      "id": 5,
      "user_id": 1,
      "product_id": 1,
      "quantity": 2,
      "name": "Morning Ritual Green",
      "price": 14.00,
      "image_url": "https://..."
    }
  ],
  "total": 28.00
}
```

### Add to Cart
- **Endpoint**: `POST /cart/add`
- **Auth Required**: Yes
- **Request Body**:
```json
{
  "product_id": 1,
  "quantity": 2
}
```
- **Response**: Cart item object

### Update Cart Item Quantity
- **Endpoint**: `PUT /cart/{itemId}`
- **Auth Required**: Yes
- **Request Body**:
```json
{
  "quantity": 3
}
```
- **Response**: Updated cart item object

### Remove Item from Cart
- **Endpoint**: `DELETE /cart/{itemId}`
- **Auth Required**: Yes
- **Response**:
```json
{
  "message": "Item removed from cart"
}
```

### Clear Entire Cart
- **Endpoint**: `DELETE /cart`
- **Auth Required**: Yes
- **Response**:
```json
{
  "message": "Cart cleared"
}
```

---

## Order Routes

> ⚠️ All order routes require authentication

### Create Order (from cart)
- **Endpoint**: `POST /orders/create`
- **Auth Required**: Yes
- **Request Body**:
```json
{
  "shipping_address": "123 Main St, San Francisco, CA 94102",
  "billing_address": "123 Main St, San Francisco, CA 94102",
  "notes": "Please leave at door"
}
```
- **Response**:
```json
{
  "order": {
    "id": 12,
    "user_id": 1,
    "order_number": "ORD-1234567890-1",
    "total_amount": 58.00,
    "status": "placed",
    "payment_status": "pending",
    "shipping_address": "123 Main St...",
    "billing_address": "123 Main St...",
    "notes": "Please leave at door",
    "created_at": "2024-02-27T12:30:00Z",
    "updated_at": "2024-02-27T12:30:00Z"
  },
  "message": "Order created successfully"
}
```

### Get User's Orders
- **Endpoint**: `GET /orders`
- **Auth Required**: Yes
- **Response**: Array of order objects

### Get Order Details
- **Endpoint**: `GET /orders/{orderId}`
- **Auth Required**: Yes
- **Response**:
```json
{
  "order": { ...order object },
  "items": [
    {
      "id": 1,
      "product_id": 1,
      "quantity": 2,
      "price_at_purchase": 14.00,
      "name": "Morning Ritual Green",
      "category": "juices"
    }
  ],
  "payment": {
    "id": 5,
    "order_id": 12,
    "stripe_charge_id": "ch_...",
    "amount": 58.00,
    "status": "completed",
    "payment_method": "stripe"
  }
}
```

---

## Payment Routes

> ⚠️ All payment routes require authentication

### Create Payment Intent
- **Endpoint**: `POST /payment/create-intent`
- **Auth Required**: Yes
- **Request Body**:
```json
{
  "order_id": 12
}
```
- **Response**:
```json
{
  "client_secret": "pi_12345_secret_...",
  "payment_intent_id": "pi_12345"
}
```

### Confirm Payment
- **Endpoint**: `POST /payment/confirm`
- **Auth Required**: Yes
- **Request Body**:
```json
{
  "order_id": 12,
  "stripe_charge_id": "ch_..."
}
```
- **Response**:
```json
{
  "payment": {
    "id": 5,
    "order_id": 12,
    "stripe_charge_id": "ch_...",
    "amount": 58.00,
    "status": "completed",
    "payment_method": "stripe",
    "created_at": "2024-02-27T12:35:00Z"
  },
  "message": "Payment confirmed"
}
```

### Get Payment for Order
- **Endpoint**: `GET /payment/{orderId}`
- **Auth Required**: Yes
- **Response**: Payment object

---

## Admin Routes

> ⚠️ All admin routes require authentication with admin role

### Get All Orders
- **Endpoint**: `GET /admin/orders`
- **Auth Required**: Yes (Admin)
- **Query Parameters**:
  - `status` (optional): Filter by status
  - `limit` (optional): Results per page (default: 50)
  - `offset` (optional): Pagination offset (default: 0)
- **Example**: `GET /admin/orders?status=pending&limit=20&offset=0`
- **Response**: Array of order objects

### Get Order Details (Admin)
- **Endpoint**: `GET /admin/orders/{orderId}`
- **Auth Required**: Yes (Admin)
- **Response**:
```json
{
  "order": { ...order },
  "items": [...],
  "payment": {...},
  "customer": {
    "id": 1,
    "email": "user@example.com",
    "full_name": "John Doe",
    "phone": "(555) 123-4567"
  }
}
```

### Update Order Status
- **Endpoint**: `PUT /admin/orders/{orderId}/status`
- **Auth Required**: Yes (Admin)
- **Request Body**:
```json
{
  "status": "processing"
}
```
- **Valid Statuses**: `pending`, `placed`, `confirmed`, `processing`, `shipped`, `delivered`, `cancelled`
- **Response**: Updated order object

### Create Product
- **Endpoint**: `POST /admin/products`
- **Auth Required**: Yes (Admin)
- **Request Body**:
```json
{
  "name": "New Green Juice",
  "category": "juices",
  "price": 16.00,
  "description": "Fresh pressed green juice",
  "ingredients": "Kale, Spinach, Celery, Lemon",
  "image_url": "https://...",
  "stock": 30
}
```
- **Response**: New product object with ID

### Update Product
- **Endpoint**: `PUT /admin/products/{productId}`
- **Auth Required**: Yes (Admin)
- **Request Body**: Any fields to update (all optional)
```json
{
  "stock": 25,
  "price": 15.00,
  "available": true
}
```
- **Response**: Updated product object

### Get Dashboard Stats
- **Endpoint**: `GET /admin/stats/dashboard`
- **Auth Required**: Yes (Admin)
- **Response**:
```json
{
  "total_orders": 156,
  "total_revenue": 5284.50,
  "total_products": 24,
  "total_users": 89
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "error": "Description of what went wrong"
}
```

### Common Status Codes
- `200`: Success
- `201`: Created successfully
- `400`: Bad request (missing/invalid data)
- `401`: Unauthorized (no token or invalid token)
- `403`: Forbidden (sufficient privileges required)
- `404`: Not found
- `500`: Server error

---

## Authentication Header Format

For protected routes, include:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Rate Limiting

Currently no rate limiting is implemented. Production deployment should add:
- Express rate limiter: `npm install express-rate-limit`
- API limits per IP/user
- Stripe rate limits (automatic)

---

## CORS Configuration

Frontend can make requests from:
- `http://localhost:3000` (development)
- Your production domain

Update in `server.js` if needed:
```javascript
cors({
  origin: ['http://localhost:3000', 'https://your-domain.com']
})
```
