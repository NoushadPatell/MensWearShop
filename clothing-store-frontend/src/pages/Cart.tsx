import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context';
import { orderAPI } from '../api';

export const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, clearCart, getCartTotal } = useApp();
  const [loading, setLoading] = React.useState(false);

  const handleCheckout = async () => {
    const address = prompt('Enter shipping address:');
    if (!address) return;

    setLoading(true);
    try {
      await orderAPI.create({
        shippingAddress: address,
        items: cart.map(item => ({
          productId: item.productId,
          size: item.size,
          quantity: item.quantity
        }))
      });
      clearCart();
      alert('Order placed successfully!');
      navigate('/orders');
    } catch (error) {
      alert('Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream-50 via-white to-amber-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          {/* Empty cart illustration */}
          <div className="mb-8">
            <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 4H4m4 9v6a1 1 0 001 1h8a1 1 0 001-1v-6m-6 6v-6m-4 6v-6" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Your cart is empty</h2>
            <p className="text-gray-600 text-lg mb-8">Looks like you haven't added anything to your cart yet. Discover our amazing collection!</p>
          </div>
          
          <button 
            onClick={() => navigate('/products')} 
            className="group px-8 py-4 bg-gradient-to-r from-gray-800 to-gray-700 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative z-10 text-lg flex items-center space-x-2">
              <span>Continue Shopping</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 via-white to-amber-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent mb-3">
            Shopping Cart
          </h1>
          <p className="text-gray-600 text-lg">Review your items and proceed to checkout</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Items in Cart ({cart.length})</h2>
              <button
                onClick={clearCart}
                className="text-red-600 hover:text-red-700 font-medium text-sm hover:underline transition-colors duration-200"
              >
                Clear All
              </button>
            </div>

            {cart.map((item, index) => (
              <div key={`${item.productId}-${item.size}`} className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300">
                <div className="flex gap-6">
                  {/* Product Image */}
                  <div className="relative">
                    <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden shadow-md">
                      <img
                        src={item.product.imageUrl || '/api/placeholder/100/100'}
                        alt={item.product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                      {item.quantity}
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg text-gray-900 mb-2 truncate">
                      {item.product.name}
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full">
                        Size: {item.size}
                      </span>
                      <span className="bg-amber-100 text-amber-800 text-sm px-3 py-1 rounded-full">
                        Qty: {item.quantity}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {item.product.description}
                    </p>
                  </div>

                  {/* Price and Actions */}
                  <div className="text-right flex flex-col justify-between">
                    <div className="mb-4">
                      <p className="text-sm text-gray-500 mb-1">
                        ${item.product.price} × {item.quantity}
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                    
                    <button
                      onClick={() => removeFromCart(item.productId, item.size)}
                      className="group/btn flex items-center space-x-2 text-red-600 hover:text-red-700 text-sm font-medium transition-colors duration-200"
                    >
                      <svg className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/50 sticky top-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <svg className="w-6 h-6 mr-2 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Order Summary
              </h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Subtotal ({cart.length} items)</span>
                  <span className="font-semibold text-gray-900">${getCartTotal().toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Shipping</span>
                  <div className="text-right">
                    <span className="font-semibold text-green-600">Free</span>
                    <p className="text-xs text-gray-500">On orders over $75</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-semibold text-gray-900">Calculated at checkout</span>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                      ${getCartTotal().toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => navigate('/checkout')}
                  disabled={loading}
                  className="group w-full py-4 bg-gradient-to-r from-gray-800 to-gray-700 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10 flex items-center justify-center space-x-2">
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <span>Proceed to Checkout</span>
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </>
                    )}
                  </span>
                </button>

                <button
                  onClick={() => navigate('/products')}
                  className="w-full py-3 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-cream-50 hover:border-gray-300 transition-all duration-200"
                >
                  Continue Shopping
                </button>
              </div>

              {/* Trust badges */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="text-xs text-gray-600">
                    <div className="text-lg mb-1">🔒</div>
                    <span>Secure Payment</span>
                  </div>
                  <div className="text-xs text-gray-600">
                    <div className="text-lg mb-1">📦</div>
                    <span>Fast Delivery</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};