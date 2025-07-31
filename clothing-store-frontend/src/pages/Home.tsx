import React from 'react';
import { Link } from 'react-router-dom';

export const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 via-white to-amber-50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-amber-100/30 to-orange-100/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-cream-100/40 to-yellow-100/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-white/10 to-cream-100/20 rounded-full blur-3xl"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 text-center">
        
        <h1 className="text-6xl md:text-7xl font-extrabold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent mb-6 leading-tight">
          Welcome to
          <span className="block bg-gradient-to-r from-amber-600 via-orange-500 to-yellow-600 bg-clip-text text-transparent">
            LocalWear
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
          Discover the latest fashion trends with our curated collection of premium clothing.
          <span className="block mt-2 font-medium text-gray-800">Shop with confidence and elevate your style.</span>
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <Link 
            to="/products" 
            className="group relative px-8 py-4 bg-gradient-to-r from-gray-900 to-gray-800 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative z-10 text-lg">Shop Now ✨</span>
          </Link>
          
          <Link 
            to="/products" 
            className="px-8 py-4 bg-white/70 backdrop-blur-sm text-gray-800 font-semibold rounded-2xl border border-gray-200 hover:bg-white hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
          >
            <span className="text-lg">Browse Collection</span>
          </Link>
        </div>
        
        
      </div>
    </div>
  );
};