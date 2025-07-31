import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productAPI } from '../api';
import { type Product } from '../types';
import { useApp } from '../context';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, addToCart } = useApp();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) {
      productAPI.getById(Number(id))
        .then(setProduct)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream-50 via-white to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-amber-500 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream-50 via-white to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Product not found</h2>
          <p className="text-gray-500">The product you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const getSizes = (sizesString: string): string[] => {
    if (!sizesString) return [];

    try {
      const parsed = JSON.parse(sizesString);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.warn('Invalid JSON in sizes field:', sizesString);
      return sizesString.split(',').map(size => size.trim()).filter(Boolean);
    }
  };

  const sizes = getSizes(product.sizes);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      alert('Please login to add items to cart');
      navigate('/login');
      return;
    }
    if (!selectedSize && sizes.length > 0) {
      alert('Please select a size');
      return;
    }
    addToCart(product, selectedSize || 'default', quantity);
    alert('Item added to cart!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 via-white to-amber-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        {/* <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <button onClick={() => navigate('/')} className="hover:text-gray-900 transition-colors">Home</button>
            <span>•</span>
            <button onClick={() => navigate('/products')} className="hover:text-gray-900 transition-colors">Products</button>
            <span>•</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </div>
        </nav> */}

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={product.imageUrl || '/api/placeholder/500/500'}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            
            {/* Stock indicator */}
            <div className="absolute top-4 right-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                product.quantityInStock > 0 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {product.quantityInStock > 0 ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <span className="bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 text-sm font-semibold px-4 py-2 rounded-full">
                  {product.category}
                </span>
              </div>
              
              <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {product.name}
              </h1>
              
              <div className="flex items-baseline space-x-4 mb-6">
                <span className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  ${product.price}
                </span>
                <span className="text-gray-500 text-lg">
                  {product.quantityInStock} available
                </span>
              </div>
              
              <p className="text-gray-600 text-lg leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Purchase Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/50">
              {sizes.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Size</label>
                  <div className="grid grid-cols-4 gap-3">
                    {sizes.map((size: string) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`py-3 px-4 rounded-xl border-2 transition-all duration-200 font-medium ${
                          selectedSize === size
                            ? 'border-amber-500 bg-amber-50 text-amber-800'
                            : 'border-gray-200 bg-white hover:border-gray-300 text-gray-700'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Quantity</label>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 bg-white border-2 border-gray-200 rounded-xl hover:border-gray-300 transition-colors duration-200 flex items-center justify-center text-gray-600 hover:text-gray-800 font-bold"
                  >
                    −
                  </button>
                  <span className="text-2xl font-bold text-gray-900 min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.quantityInStock, quantity + 1))}
                    className="w-12 h-12 bg-white border-2 border-gray-200 rounded-xl hover:border-gray-300 transition-colors duration-200 flex items-center justify-center text-gray-600 hover:text-gray-800 font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center mb-6 p-4 bg-cream-50 rounded-xl">
                <span className="text-gray-700 font-medium">Total Price:</span>
                <span className="text-2xl font-bold text-gray-900">
                  ${(product.price * quantity).toFixed(2)}
                </span>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.quantityInStock === 0}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-200 ${
                  product.quantityInStock === 0
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-gray-800 to-gray-700 text-white hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0'
                }`}
              >
                {product.quantityInStock === 0 ? 'Out of Stock' : 'Add to Cart 🛒'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};