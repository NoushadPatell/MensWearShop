import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context';

export const Header: React.FC = () => {
  const { user, isAuthenticated, logout, cart } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-sm border-b border-cream-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-2 rounded-xl group-hover:scale-105 transition-transform duration-200">
              <span className="text-white text-xl font-bold">LW</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              LocalWear
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/products" 
              className="relative text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200 py-2 group"
            >
              Products
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-orange-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            
            {isAuthenticated && user?.role === 'CUSTOMER' && (
              <Link 
                to="/orders" 
                className="relative text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200 py-2 group"
              >
                My Orders
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-orange-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
            )}
            
            {isAuthenticated && user?.role === 'ADMIN' && (
              <Link 
                to="/admin" 
                className="relative text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200 py-2 group"
              >
                Admin
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-orange-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
            )}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Cart Icon */}
            {isAuthenticated && (
              <Link 
                to="/cart" 
                className="relative p-3 hover:bg-cream-50 rounded-xl transition-colors duration-200 group"
              >
                <div className="relative">
                  <svg className="w-6 h-6 text-gray-700 group-hover:text-gray-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 4H4m4 9v6a1 1 0 001 1h8a1 1 0 001-1v-6m-6 6v-6m-4 6v-6" />
                  </svg>
                  {cart.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                      {cart.reduce((sum, item) => sum + item.quantity, 0)}
                    </span>
                  )}
                </div>
              </Link>
            )}

            {/* User section */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div className="hidden sm:flex items-center space-x-2 bg-cream-50 px-4 py-2 rounded-xl">
                  <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">Hi, {user?.name}</span>
                </div>
                <button 
                  onClick={handleLogout} 
                  className="px-4 py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-cream-50 hover:border-gray-300 transition-all duration-200 hover:shadow-sm"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="px-6 py-2.5 bg-gradient-to-r from-gray-800 to-gray-700 text-white font-semibold rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};