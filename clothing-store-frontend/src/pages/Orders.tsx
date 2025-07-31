import React, { useState, useEffect } from 'react';
import { orderAPI } from '../api';
import { type Order } from '../types';
import { useApp } from '../context';
import { OrderModal } from '../components/OrderModal';

export const Orders: React.FC = () => {
  const { isAuthenticated } = useApp();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      orderAPI.getUserOrders()
        .then(setOrders)
        .catch(_err => setError('Failed to load orders'))
        .finally(() => setLoading(false));
    }
  }, [isAuthenticated]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED': return 'bg-green-100 text-green-800 border-green-200';
      case 'PACKED': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'PLACED': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'DELIVERED': return '✅';
      case 'PACKED': return '📦';
      case 'PLACED': return '🛒';
      default: return '⏳';
    }
  };

  const getProgressPercent = (status: string) => {
    switch (status) {
      case 'DELIVERED': return 100;
      case 'PACKED': return 66;
      case 'PLACED': return 33;
      default: return 0;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please log in to view orders</h2>
          <button onClick={() => window.location.href = '/login'} className="btn btn-primary">
            Login
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-red-600">Oops!</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="btn btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">Track and manage your purchases</p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🛍️</div>
            <h2 className="text-2xl font-bold mb-4">No orders yet!</h2>
            <p className="text-gray-600 mb-6">Looks like you haven't made any purchases.</p>
            <button 
              onClick={() => window.location.href = '/products'}
              className="btn btn-primary px-8 py-3"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <div
                key={order.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer border border-gray-100 group"
                onClick={() => setSelectedOrder(order)}
              >
                {/* Order Header */}
                <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{getStatusIcon(order.status)}</span>
                        <h3 className="text-xl font-bold text-gray-900">Order #{order.id}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        📅 Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">${order.totalPrice.toFixed(2)}</p>
                      <p className="text-sm text-gray-500">{order.items.length} item{order.items.length > 1 ? 's' : ''}</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-gray-500 mb-2">
                      <span className={order.status === 'PLACED' || order.status === 'PACKED' || order.status === 'DELIVERED' ? 'font-medium text-blue-600' : ''}>
                        Order Placed
                      </span>
                      <span className={order.status === 'PACKED' || order.status === 'DELIVERED' ? 'font-medium text-yellow-600' : ''}>
                        Packed
                      </span>
                      <span className={order.status === 'DELIVERED' ? 'font-medium text-green-600' : ''}>
                        Delivered
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-1000 ${
                          order.status === 'DELIVERED' ? 'bg-gradient-to-r from-green-400 to-green-600' :
                          order.status === 'PACKED' ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                          'bg-gradient-to-r from-blue-400 to-blue-600'
                        }`}
                        style={{ width: `${getProgressPercent(order.status)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Order Items Preview */}
                <div className="p-6">
                  <div className="flex flex-wrap gap-3 mb-4">
                    {order.items.slice(0, 3).map(item => (
                      <div key={item.id} className="flex items-center gap-3 bg-gray-50 rounded-lg p-3 min-w-0">
                        <img
                          src={item.product.imageUrl || '/api/placeholder/40/40'}
                          alt={item.product.name}
                          className="w-10 h-10 rounded-lg object-cover border"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm truncate">{item.product.name}</p>
                          <p className="text-xs text-gray-500">Size: {item.size} • Qty: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-bold text-blue-600">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="flex items-center justify-center bg-gray-50 rounded-lg p-3 min-w-[120px]">
                        <p className="text-sm text-gray-600">+{order.items.length - 3} more items</p>
                      </div>
                    )}
                  </div>

                  {/* Shipping Info */}
                  <div className="border-t border-gray-100 pt-4">
                    <p className="text-sm text-gray-600">
                      📍 <strong>Shipping to:</strong> {order.shippingAddress.length > 60 
                        ? `${order.shippingAddress.substring(0, 60)}...` 
                        : order.shippingAddress}
                    </p>
                  </div>

                  {/* Click to view details */}
                  <div className="mt-4 text-center">
                    <p className="text-blue-600 text-sm font-medium group-hover:text-blue-700 transition-colors">
                      👆 Click to view full order details
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Order Details Modal */}
        <OrderModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      </div>
    </div>
  );
};
