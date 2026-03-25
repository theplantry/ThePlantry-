'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-stone-50 border-t border-stone-200 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <h3 className="serif text-xl mb-6">The Plantry</h3>
            <p className="text-sm text-stone-600">
              Island-grown plant-based wellness provisions crafted with intention.
            </p>
          </div>

          <div>
            <h4 className="text-sm uppercase tracking-widest font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-stone-600">
              <li><Link href="/shop" className="hover:text-stone-900">All Products</Link></li>
              <li><Link href="/shop" className="hover:text-stone-900">Beverages</Link></li>
              <li><Link href="/shop" className="hover:text-stone-900">Snacks</Link></li>
              <li><Link href="/shop" className="hover:text-stone-900">Supplements</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm uppercase tracking-widest font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-stone-600">
              <li><Link href="/story" className="hover:text-stone-900">Our Story</Link></li>
              <li><Link href="/locations" className="hover:text-stone-900">Locations</Link></li>
              <li><Link href="/admin" className="hover:text-stone-900">Admin</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm uppercase tracking-widest font-semibold mb-4">Contact</h4>
            <p className="text-sm text-stone-600">Kingston, Jamaica</p>
            <p className="text-sm text-stone-600">info@theplantry.com</p>
          </div>
        </div>

        <div className="border-t border-stone-200 pt-8 text-center text-xs text-stone-500">
          <p>&copy; 2026 The Plantry. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
