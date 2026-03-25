'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0, pendingOrders: 0, totalProducts: 0 });
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  useEffect(() => {
    checkAdminAuth();
    loadDashboard();
  }, []);

  const checkAdminAuth = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login?redirect=/admin');
    }
  };

  const loadDashboard = async () => {
    try {
      const token = localStorage.getItem('token');
      // For now, use mock data
      setStats({
        totalOrders: 12,
        totalRevenue: 85000,
        pendingOrders: 3,
        totalProducts: 6,
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const loadOrders = async () => {
    try {
      const response = await fetch('/api/admin/orders');
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const loadProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-stone-50/80 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <a href="/" className="text-2xl tracking-[0.3em] uppercase serif font-medium">
            The Plantry
          </a>
          <div className="flex items-center space-x-6">
            <span className="text-sm text-stone-600">Admin Dashboard</span>
            <button
              onClick={logout}
              className="text-sm uppercase tracking-widest text-stone-500 hover:text-stone-900"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Tab Navigation */}
        <div className="flex space-x-8 border-b border-stone-200 mb-12">
          <button
            onClick={() => { setActiveTab('dashboard'); loadDashboard(); }}
            className={`tab-btn px-4 py-3 font-semibold ${activeTab === 'dashboard' ? 'border-b-2 border-stone-900' : ''}`}
          >
            Dashboard
          </button>
          <button
            onClick={() => { setActiveTab('orders'); loadOrders(); }}
            className={`tab-btn px-4 py-3 font-semibold ${activeTab === 'orders' ? 'border-b-2 border-stone-900' : ''}`}
          >
            Orders
          </button>
          <button
            onClick={() => { setActiveTab('products'); loadProducts(); }}
            className={`tab-btn px-4 py-3 font-semibold ${activeTab === 'products' ? 'border-b-2 border-stone-900' : ''}`}
          >
            Products
          </button>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <div className="bg-white border border-stone-200 rounded-lg p-8 text-center">
                <p className="text-stone-500 text-sm mb-2">Total Orders</p>
                <p className="text-4xl font-bold mb-2">{stats.totalOrders}</p>
                <p className="text-xs text-stone-400">All time</p>
              </div>
              <div className="bg-white border border-stone-200 rounded-lg p-8 text-center">
                <p className="text-stone-500 text-sm mb-2">Total Revenue</p>
                <p className="text-4xl font-bold mb-2">${(stats.totalRevenue / 100).toFixed(2)}</p>
                <p className="text-xs text-stone-400">Paid orders</p>
              </div>
              <div className="bg-white border border-stone-200 rounded-lg p-8 text-center">
                <p className="text-stone-500 text-sm mb-2">Pending Orders</p>
                <p className="text-4xl font-bold mb-2">{stats.pendingOrders}</p>
                <p className="text-xs text-stone-400">Awaiting action</p>
              </div>
              <div className="bg-white border border-stone-200 rounded-lg p-8 text-center">
                <p className="text-stone-500 text-sm mb-2">Total Products</p>
                <p className="text-4xl font-bold mb-2">{stats.totalProducts}</p>
                <p className="text-xs text-stone-400">Active catalog</p>
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="bg-white border border-stone-200 rounded-lg p-8">
            <h3 className="serif text-2xl mb-6">Orders Management</h3>
            <p className="text-stone-600">Orders management UI coming soon...</p>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="bg-white border border-stone-200 rounded-lg p-8">
            <h3 className="serif text-2xl mb-6">Product Catalog</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-stone-200">
                    <th className="text-left py-4 px-4 font-semibold">Product Name</th>
                    <th className="text-left py-4 px-4 font-semibold">Category</th>
                    <th className="text-left py-4 px-4 font-semibold">Price</th>
                    <th className="text-left py-4 px-4 font-semibold">Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b border-stone-200">
                      <td className="py-4 px-4">{product.name}</td>
                      <td className="py-4 px-4">{product.category}</td>
                      <td className="py-4 px-4">${(product.price / 100).toFixed(2)}</td>
                      <td className="py-4 px-4">{product.stock || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
