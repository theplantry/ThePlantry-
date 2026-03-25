import express from 'express';
import Stripe from 'stripe';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');

// Currency rates (mock - in production fetch from API)
const currencyRates = {
  'USD': 1.0,
  'EUR': 0.92,
  'GBP': 0.79,
  'CAD': 1.36,
  'AUD': 1.53,
  'JMD': 154.5,
};

// Get currency rate
router.post('/currency-rate', (req, res) => {
  const { currency = 'USD' } = req.body;
  const rate = currencyRates[currency] || 1.0;
  res.json({ currency, rate, timestamp: new Date().toISOString() });
});

// Calculate order summary
router.post('/calculate-total', (req, res) => {
  const { items, currency = 'USD' } = req.body;
  
  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'No items in cart' });
  }

  // Calculate subtotal
  let subtotalUSD = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Apply currency conversion
  const rate = currencyRates[currency] || 1.0;
  const subtotal = Math.round(subtotalUSD * rate);
  
  // Calculate 6% processing fee
  const processingFee = Math.round(subtotal * 0.06);
  
  // Calculate total
  const total = subtotal + processingFee;
  
  res.json({
    subtotal,
    processingFee,
    processingFeePercent: 6,
    total,
    currency,
    exchangeRate: rate,
    itemCount: items.length
  });
});

// Create Stripe payment intent
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'usd', email, metadata = {} } = req.body;

    // Convert amount to cents (Stripe works with smallest currency unit)
    const amountInCents = Math.round(amount * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: currency.toLowerCase(),
      payment_method_types: ['card'],
      receipt_email: email,
      metadata: {
        ...metadata,
        timestamp: new Date().toISOString()
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      publicKey: process.env.STRIPE_PUBLIC_KEY || 'pk_test_placeholder'
    });
  } catch (error) {
    console.error('Payment intent error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Confirm payment
router.post('/confirm-payment', async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      res.json({
        success: true,
        orderId: `ORD-${Date.now()}`,
        amount: (paymentIntent.amount / 100).toFixed(2),
        currency: paymentIntent.currency.toUpperCase(),
        email: paymentIntent.receipt_email,
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(400).json({ 
        success: false, 
        error: 'Payment not completed',
        status: paymentIntent.status 
      });
    }
  } catch (error) {
    console.error('Payment confirmation error:', error);
    res.status(400).json({ error: error.message });
  }
});

export default router;
