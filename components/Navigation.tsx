'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Navigation({ cartCount = 0 }: { cartCount: number }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Announcement Bar */}
      <div className="w-full bg-stone-900 text-stone-50 py-2.5 text-center text-[9px] md:text-[10px] tracking-[0.25em] uppercase fixed top-0 z-[70]">
        Island-wide delivery available | Fresh from the Blue Mountains
      </div>

      {/* Navigation */}
      <nav className="fixed top-[35px] w-full z-50 glass-nav border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="text-2xl tracking-[0.3em] uppercase serif font-medium hidden md:block">
            The Plantry
          </Link>

          <div className="hidden md:flex space-x-12">
            <Link href="/" className="nav-link">Home</Link>
            <Link href="/shop" className="nav-link">Shop</Link>
            <Link href="/story" className="nav-link">Story</Link>
            <Link href="/locations" className="nav-link">Locations</Link>
          </div>

          <div className="flex items-center space-x-6">
            <Link href="/login" className="text-[10px] tracking-widest uppercase text-stone-500 hover:text-stone-900">
              Account
            </Link>
            <Link href="/checkout" className="relative text-stone-900 hover:text-stone-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-stone-900 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-stone-900"
            >
              ☰
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[80] bg-stone-50 flex flex-col p-10 md:hidden mt-[75px]">
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="absolute top-10 right-10"
          >
            ✕
          </button>
          <div className="flex flex-col space-y-8 mt-20 text-2xl serif italic">
            <Link href="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link href="/shop" onClick={() => setMobileMenuOpen(false)}>Shop</Link>
            <Link href="/story" onClick={() => setMobileMenuOpen(false)}>Story</Link>
            <Link href="/locations" onClick={() => setMobileMenuOpen(false)}>Locations</Link>
          </div>
        </div>
      )}
    </>
  );
}
