'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ProductModal from '@/components/ProductModal';
import Toast from '@/components/Toast';

export default function Home() {
  const [currentPage, setCurrentPage] = useState('home');
  const [shopProducts, setShopProducts] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    loadCartCount();
    loadShopProducts();
  }, []);

  const loadCartCount = () => {
    const cart = JSON.parse(localStorage.getItem('cartItems') || '[]');
    setCartCount(cart.length);
  };

  const loadShopProducts = async (category = 'all') => {
    try {
      const response = await fetch('/api/products');
      const products = await response.json();
      
      if (category === 'all') {
        setShopProducts(products);
      } else {
        setShopProducts(products.filter((p: any) => p.category === category));
      }
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const openProductModal = (product: any) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const addToCart = (productId: number, productName: string, price: number, quantity: number) => {
    const cart = JSON.parse(localStorage.getItem('cartItems') || '[]');
    cart.push({ id: productId, name: productName, price, quantity });
    localStorage.setItem('cartItems', JSON.stringify(cart));
    setCartCount(cart.length);
    setToastMessage(`Added ${quantity}x ${productName} to cart`);
    setShowModal(false);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  return (
    <>
      <Navigation cartCount={cartCount} />
      <main className="pt-[115px]">
        
        {/* HOME PAGE */}
        {currentPage === 'home' && (
          <div>
            {/* Hero Section */}
            <section className="relative h-[90vh] flex items-center justify-center overflow-hidden mx-4 md:mx-6 rounded-sm">
              <img
                src="https://images.unsplash.com/photo-1528475419422-043272c1976e?auto=format&fit=crop&q=80&w=2000"
                alt="Lush Jamaican Tropical Greenery"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 hero-gradient"></div>
              <div className="relative text-center text-white px-6">
                <h1 className="text-5xl md:text-7xl serif italic mb-6">Purely Planted.</h1>
                <p className="text-sm md:text-base tracking-[0.15em] uppercase max-w-md mx-auto mb-10 opacity-90">
                  Island-grown plant-based wellness provisions crafted with intention
                </p>
                <button
                  onClick={() => setCurrentPage('shop')}
                  className="inline-block border border-white px-10 py-4 text-[11px] tracking-[0.2em] uppercase hover:bg-white hover:text-stone-900 transition-colors duration-500"
                >
                  Browse Collection
                </button>
              </div>
            </section>

            {/* About Section */}
            <section className="max-w-7xl mx-auto px-6 py-32 grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
              <div className="order-2 md:order-1">
                <img
                  src="/assets/gallery/mothers-mylk.jpg"
                  alt="Mother's Mylk"
                  className="w-full h-full object-cover rounded"
                />
              </div>
              <div className="order-1 md:order-2 space-y-6">
                <h2 className="serif text-4xl italic">The Intention</h2>
                <p className="text-stone-600 leading-relaxed">
                  We believe in the power of plants to nourish, heal, and transform. Every provision is crafted with care, sourced from Jamaica's richest botanical traditions.
                </p>
                <p className="text-stone-600 leading-relaxed">
                  Fresh, organic, and delivered with intention.
                </p>
              </div>
            </section>
          </div>
        )}

        {/* SHOP PAGE */}
        {currentPage === 'shop' && (
          <div id="shop" className="max-w-7xl mx-auto px-6 py-12">
            <div className="flex justify-between items-end mb-16 space-y-4">
              <div>
                <h2 className="serif text-4xl italic mb-2">Shop</h2>
                <p className="text-stone-500">Curated provisions for daily wellness</p>
              </div>
              <div className="flex space-x-6 text-[11px] uppercase tracking-widest text-stone-400">
                <button onClick={() => loadShopProducts('all')} className="filter-btn active">All</button>
                <button onClick={() => loadShopProducts('Beverages')} className="filter-btn">Beverages</button>
                <button onClick={() => loadShopProducts('Snacks')} className="filter-btn">Snacks</button>
                <button onClick={() => loadShopProducts('Supplements')} className="filter-btn">Supplements</button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {shopProducts.map((product: any) => (
                <div key={product.id} className="product-card group cursor-pointer">
                  <div className="img-container h-80 mb-6 overflow-hidden rounded">
                    <img
                      src={product.image_url || '/placeholder.jpg'}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="serif text-2xl mb-2">{product.name}</h3>
                  <p className="text-stone-600 text-sm mb-4">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-semibold">${(product.price / 100).toFixed(2)}</span>
                    <button
                      onClick={() => openProductModal(product)}
                      className="px-4 py-2 bg-stone-900 text-white text-xs uppercase tracking-widest rounded hover:opacity-90"
                    >
                      View & Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STORY PAGE */}
        {currentPage === 'story' && (
          <section className="max-w-4xl mx-auto px-6 py-24 text-center">
            <h2 className="serif text-5xl italic mb-12">Our Story</h2>
            <p className="text-lg text-stone-600 mb-8 leading-relaxed">
              The Plantry was born from a vision to bring Jamaica's botanical richness to the world. Founded on principles of sustainability and wellness, we craft provisions that honor both tradition and innovation.
            </p>
            <p className="text-lg text-stone-600 leading-relaxed">
              Every product is a testament to our commitment to quality, purity, and the transformative power of plants.
            </p>
          </section>
        )}

        {/* LOCATIONS PAGE */}
        {currentPage === 'locations' && (
          <section className="max-w-6xl mx-auto px-6 py-24">
            <h2 className="serif text-5xl italic mb-12 text-center">Locations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="bg-white p-8 rounded border border-stone-200">
                <h3 className="serif text-2xl mb-4">Kingston</h3>
                <p className="text-stone-600 mb-2">85 Hope Road</p>
                <p className="text-stone-600 mb-4">Kingston 6, Jamaica</p>
                <p className="text-stone-600">Open Tuesday-Sunday, 9am - 6pm</p>
              </div>
              <div className="bg-white p-8 rounded border border-stone-200">
                <h3 className="serif text-2xl mb-4">Montego Bay</h3>
                <p className="text-stone-600 mb-2">2 Fairview Avenue</p>
                <p className="text-stone-600 mb-4">Montego Bay, Jamaica</p>
                <p className="text-stone-600">Open Tuesday-Sunday, 9am - 6pm</p>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
      
      {showModal && selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setShowModal(false)}
          onAddToCart={addToCart}
        />
      )}

      {toastMessage && <Toast message={toastMessage} />}
    </>
  );
}
