'use client';

import { useState } from 'react';

interface ProductModalProps {
  product: any;
  onClose: () => void;
  onAddToCart: (id: number, name: string, price: number, quantity: number) => void;
}

export default function ProductModal({ product, onClose, onAddToCart }: ProductModalProps) {
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    onAddToCart(product.id, product.name, product.price, quantity);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex gap-6 p-8">
          {/* Product Image */}
          <div className="flex-shrink-0 w-64">
            <img
              src={product.image_url || '/placeholder.jpg'}
              alt={product.name}
              className="w-full h-64 object-cover rounded"
            />
          </div>

          {/* Product Details */}
          <div className="flex-1">
            <button
              onClick={onClose}
              className="text-2xl text-stone-500 hover:text-stone-900 ml-auto block"
            >
              ✕
            </button>

            <h2 className="serif text-3xl mb-2">{product.name}</h2>
            <p className="text-stone-600 mb-4">{product.category}</p>

            <p className="text-lg font-semibold mb-6">${(product.price / 100).toFixed(2)}</p>

            <p className="text-stone-600 mb-8">{product.description}</p>

            {product.ingredients && (
              <div className="mb-8">
                <h4 className="font-semibold mb-2">Ingredients</h4>
                <p className="text-sm text-stone-600">{product.ingredients}</p>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="mb-8">
              <label className="block text-sm uppercase tracking-widest font-semibold mb-2">
                Quantity
              </label>
              <div className="flex items-center border border-stone-200 rounded w-fit">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 text-stone-900 hover:bg-stone-50"
                >
                  −
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 text-center border-none outline-none"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 text-stone-900 hover:bg-stone-50"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-stone-900 text-white py-3 uppercase text-sm tracking-widest font-semibold rounded hover:opacity-90"
              >
                Add to Cart
              </button>
              <button
                onClick={onClose}
                className="flex-1 border border-stone-200 text-stone-900 py-3 uppercase text-sm tracking-widest font-semibold rounded hover:bg-stone-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
