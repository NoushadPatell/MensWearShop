import React from 'react';
import { type Order } from '../types';

interface OrderModalProps {
  order: Order | null;
  onClose: () => void;
}

export const OrderModal: React.FC<OrderModalProps> = ({ order, onClose }) => {
  if (!order) return null;

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{getStatusIcon(order.status)}</span>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Order #{order.id}</h2>
                <p className="text-sm text-gray-600">
                  📅 {new Date(order.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold w-8 h-8 flex items-center justify-center"
              >
                ×
              </button>
            </div>
          </div>

          {/* Progress Timeline */}
          <div className="mt-6">
            <div className="flex justify-between text-sm font-medium mb-3">
              <span className={`flex items-center gap-2 ${order.status === 'PLACED' || order.status === 'PACKED' || order.status === 'DELIVERED' ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-3 h-3 rounded-full ${order.status === 'PLACED' || order.status === 'PACKED' || order.status === 'DELIVERED' ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                Order Placed
              </span>
              <span className={`flex items-center gap-2 ${order.status === 'PACKED' || order.status === 'DELIVERED' ? 'text-yellow-600' : 'text-gray-400'}`}>
                <div className={`w-3 h-3 rounded-full ${order.status === 'PACKED' || order.status === 'DELIVERED' ? 'bg-yellow-600' : 'bg-gray-300'}`}></div>
                Packed
              </span>
              <span className={`flex items-center gap-2 ${order.status === 'DELIVERED' ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-3 h-3 rounded-full ${order.status === 'DELIVERED' ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                Delivered
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-1000 ${
                  order.status === 'DELIVERED' ? 'bg-gradient-to-r from-green-400 to-green-600' :
                  order.status === 'PACKED' ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                  'bg-gradient-to-r from-blue-400 to-blue-600'
                }`}
                style={{ width: `${getProgressPercent(order.status)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Order Items */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Items Ordered</h3>
            <div className="space-y-4">
              {order.items.map(item => (
                <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                  <img
                    src={item.product.imageUrl || '/api/placeholder/80/80'}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-lg border"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{item.product.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{item.product.description}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="bg-white px-3 py-1 rounded-full border">Size: {item.size}</span>
                      <span className="bg-white px-3 py-1 rounded-full border">Qty: {item.quantity}</span>
                      <span className="bg-white px-3 py-1 rounded-full border">
                        ${item.price.toFixed(2)} each
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-blue-600">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {item.quantity} × ${item.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-blue-50 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Order Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal ({order.items.length} items)</span>
                <span>${order.totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>$0.00</span>
              </div>
              <div className="border-t border-blue-200 pt-2 mt-2">
                <div className="flex justify-between text-xl font-bold text-gray-900">
                  <span>Total</span>
                  <span className="text-blue-600">${order.totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-900 flex items-center gap-2">
              📍 Shipping Address
            </h3>
            <p className="text-gray-700 leading-relaxed">{order.shippingAddress}</p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              Need help? Contact our <a href="#" className="text-blue-600 hover:underline">customer support</a>
            </p>
            <button
              onClick={onClose}
              className="btn btn-primary px-6 py-2"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
