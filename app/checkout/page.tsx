'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  });
  const [currency, setCurrency] = useState('USD');
  const [orderSummary, setOrderSummary] = useState({
    subtotal: 0,
    fee: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCart();
  }, []);

  useEffect(() => {
    calculateTotal();
  }, [currency, cartItems]);

  const loadCart = () => {
    const cart = JSON.parse(localStorage.getItem('cartItems') || '[]');
    setCartItems(cart);
  };

  const calculateTotal = () => {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const fee = Math.ceil(subtotal * 0.06); // 6% processing fee
    const total = subtotal + fee;

    setOrderSummary({
      subtotal,
      fee,
      total,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create payment intent
      const response = await fetch('/api/checkout/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: orderSummary.total,
          currency: currency.toLowerCase(),
          email: formData.email,
          metadata: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            address: formData.address,
          }
        }),
      });

      const { clientSecret, orderId } = await response.json();

      // For now, simulate successful payment
      localStorage.removeItem('cartItems');
      router.push(`/order-confirmation?order=${orderId}`);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to process order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navigation cartCount={cartItems.length} />
      <main className="max-w-6xl mx-auto px-6 py-16">
        <h1 className="serif text-4xl mb-12">Secure Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Contact Info */}
              <div className="bg-white p-8 rounded-lg border border-stone-200">
                <h2 className="serif text-2xl mb-6">Contact Information</h2>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-stone-200 px-4 py-3 rounded mb-4 focus:outline-none focus:border-stone-900"
                />
              </div>

              {/* Shipping Info */}
              <div className="bg-white p-8 rounded-lg border border-stone-200">
                <h2 className="serif text-2xl mb-6">Shipping Address</h2>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="border border-stone-200 px-4 py-3 rounded focus:outline-none focus:border-stone-900"
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="border border-stone-200 px-4 py-3 rounded focus:outline-none focus:border-stone-900"
                  />
                </div>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full border border-stone-200 px-4 py-3 rounded mb-4 focus:outline-none focus:border-stone-900"
                />
                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-stone-200 px-4 py-3 rounded mb-4 focus:outline-none focus:border-stone-900"
                />
                <div className="grid grid-cols-3 gap-4">
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="border border-stone-200 px-4 py-3 rounded focus:outline-none focus:border-stone-900"
                  />
                  <input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="border border-stone-200 px-4 py-3 rounded focus:outline-none focus:border-stone-900"
                  />
                  <input
                    type="text"
                    name="zipCode"
                    placeholder="ZIP Code"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    className="border border-stone-200 px-4 py-3 rounded focus:outline-none focus:border-stone-900"
                  />
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-white p-8 rounded-lg border border-stone-200">
                <h2 className="serif text-2xl mb-6">Payment Method</h2>
                <p className="text-stone-600 mb-4">Stripe integration coming soon. Using test payment for demo.</p>
                <div className="border border-stone-200 px-4 py-3 rounded bg-stone-50 text-stone-600">
                  Demo: Payment processing ready with real Stripe keys
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-stone-900 text-white py-4 uppercase text-sm tracking-widest font-semibold rounded hover:opacity-90 disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Complete Purchase'}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-stone-100 p-8 rounded-lg sticky top-32">
              <h3 className="serif text-2xl mb-6">Order Summary</h3>

              <div className="space-y-4 mb-6 pb-6 border-b">
                {cartItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span>{item.name} x{item.quantity}</span>
                    <span>${((item.price * item.quantity) / 100).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-6 pb-6 border-b">
                <div className="flex justify-between">
                  <span className="text-stone-600">Subtotal</span>
                  <span>${(orderSummary.subtotal / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">Processing Fee (6%)</span>
                  <span>${(orderSummary.fee / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="text-sm border-none bg-transparent"
                  >
                    <option>USD</option>
                    <option>EUR</option>
                    <option>GBP</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-between serif text-xl mb-8">
                <span>Total</span>
                <span>${(orderSummary.total / 100).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
