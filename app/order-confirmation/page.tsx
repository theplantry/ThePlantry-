'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order');

  return (
    <>
      <Navigation cartCount={0} />
      <main className="max-w-2xl mx-auto px-6 py-24">
        <div className="text-center">
          <div className="mb-8">
            <svg className="w-20 h-20 mx-auto text-green-600 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <h1 className="serif text-5xl mb-4">Order Confirmed</h1>
            <p className="text-lg text-stone-600">Thank you for your order. We're thrilled to nourish your journey.</p>
          </div>

          <div className="bg-stone-100 p-12 rounded mb-12">
            <div className="mb-6 pb-6 border-b">
              <p className="text-sm text-stone-500 mb-2">ORDER NUMBER</p>
              <p className="text-2xl font-semibold">{orderId ? `#${orderId}` : '#0'}</p>
            </div>

            <div className="mb-6">
              <p className="text-sm text-stone-500 mb-2">EXPECTED DELIVERY</p>
              <p className="text-lg">Tuesday or Friday</p>
            </div>

            <p className="text-sm text-stone-500">You'll receive email updates about your order status</p>
          </div>

          <div className="space-y-4">
            <p className="text-stone-600">Island-wide delivery available. Fresh from the Blue Mountains.</p>
            <Link
              href="/"
              className="inline-block bg-stone-900 text-white px-8 py-4 uppercase text-sm tracking-widest font-semibold rounded hover:opacity-90"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
