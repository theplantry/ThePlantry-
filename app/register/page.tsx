'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Registration failed');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      router.push('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navigation cartCount={0} />
      <main className="max-w-md mx-auto px-6 py-24">
        <div className="mb-12">
          <h1 className="text-4xl serif mb-2">Create Account</h1>
          <p className="text-sm text-stone-500">Join us for intentional provisions</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 mb-8">
          <div>
            <label className="block text-sm uppercase tracking-widest mb-2">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full border border-stone-300 px-4 py-3 focus:outline-none focus:border-stone-900"
            />
          </div>

          <div>
            <label className="block text-sm uppercase tracking-widest mb-2">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border border-stone-300 px-4 py-3 focus:outline-none focus:border-stone-900"
            />
          </div>

          <div>
            <label className="block text-sm uppercase tracking-widest mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full border border-stone-300 px-4 py-3 focus:outline-none focus:border-stone-900"
            />
          </div>

          <div>
            <label className="block text-sm uppercase tracking-widest mb-2">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full border border-stone-300 px-4 py-3 focus:outline-none focus:border-stone-900"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-stone-900 text-white py-4 uppercase text-sm tracking-widest font-semibold disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        {error && (
          <div className="p-4 bg-red-50 text-red-700 text-sm rounded mb-6">
            {error}
          </div>
        )}

        <div className="text-center text-sm text-stone-500">
          Already have an account?{' '}
          <Link href="/login" className="text-stone-900 border-b border-stone-900">
            Sign in
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
