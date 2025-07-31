import React, { useState, useEffect } from 'react';
import { productAPI, orderAPI } from '../api';
import { type Product, type Order } from '../types';
import { useApp } from '../context';

export const Admin: React.FC = () => {
  const { user } = useApp();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'add-product'>('products');
  const [loading, setLoading] = useState(true);
  const [showAddProduct, setShowAddProduct] = useState(false);

  // New product form state
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    sizes: '',
    quantityInStock: '',
    imageFile: null as File | null
  });

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      const [productsData, ordersData] = await Promise.all([
        productAPI.getAll(),
        orderAPI.getAllOrders()
      ]);
      setProducts(productsData);
      setOrders(ordersData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: number, status: string) => {
    try {
      await orderAPI.updateStatus(orderId, status);
      setOrders(prev => prev.map(order =>
        order.id === orderId ? { ...order, status: status as any } : order
      ));
    } catch (error) {
      alert('Failed to update order status');
    }
  };

  const handleImageUpload = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(
      'http://localhost:8080/api/admin/upload-image',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData
      }
    );

    if (!response.ok) throw new Error('Upload failed');
    const data = await response.json();
    return data.imageUrl;
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    try {
      let imageUrl = '';
      if (newProduct.imageFile) {
        imageUrl = await handleImageUpload(newProduct.imageFile);
      }

      const productData = {
        ...newProduct,
        price: parseFloat(newProduct.price),
        quantityInStock: parseInt(newProduct.quantityInStock),
        imageUrl,
      };

      await productAPI.create(productData);
      await loadData(); // Refresh data
      alert('Product added successfully!');
      setShowAddProduct(false);
      setNewProduct({
        name: '',
        description: '',
        price: '',
        category: '',
        sizes: '',
        quantityInStock: '',
        imageFile: null
      });
    } catch (error) {
      alert('Failed to add product: ' + error);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (productId: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await productAPI.delete(productId);
      setProducts(prev => prev.filter(p => p.id !== productId));
      alert('Product deleted successfully!');
    } catch (error) {
      alert('Failed to delete product');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      PLACED: 'bg-blue-100 text-blue-800 border-blue-200',
      PACKED: 'bg-amber-100 text-amber-800 border-amber-200',
      DELIVERED: 'bg-green-100 text-green-800 border-green-200'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusStyles[status as keyof typeof statusStyles] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
        {status}
      </span>
    );
  };

  if (user?.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Access Denied</h3>
            <p className="text-gray-600">Admin privileges required to access this page.</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your products and orders</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-xl">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{products.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-xl">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-xl">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${orders.reduce((sum, order) => sum + order.totalPrice, 0).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-1 mb-8 inline-flex">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${activeTab === 'products'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${activeTab === 'orders'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
          >
            Orders
          </button>
          <button
            onClick={() => setShowAddProduct(true)}
            className="px-6 py-3 rounded-xl font-medium text-sm bg-green-600 text-white hover:bg-green-700 transition-all duration-200 shadow-md ml-2"
          >
            + Add Product
          </button>
        </div>

        {/* Add Product Modal */}
        {showAddProduct && (
          <div className="fixed inset-0 bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-lg flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
            <div
              className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-hidden transform transition-all duration-300 animate-in zoom-in-95"
              style={{
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05)'
              }}
            >
              {/* Modal Header */}
              <div className="relative bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">Add New Product</h2>
                    <p className="text-blue-100 text-sm">Create a new product for your store</p>
                  </div>
                  <button
                    onClick={() => setShowAddProduct(false)}
                    className="p-3 hover:bg-white/20 rounded-2xl transition-all duration-200 group"
                  >
                    <svg className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-purple-500"></div>
              </div>

              {/* Form Content */}
              <div className="p-8 overflow-y-auto max-h-[calc(95vh-200px)]">
                <form onSubmit={handleAddProduct} className="space-y-8">
                  {/* Product Name */}
                  <div className="group">
                    <label className="flex items-center text-sm font-bold text-gray-900 mb-3">
                      <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      Product Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-gray-900 font-medium group-hover:border-gray-300"
                        placeholder="Enter an amazing product name"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                        <div className="w-2 h-2 bg-blue-500 rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="group">
                    <label className="flex items-center text-sm font-bold text-gray-900 mb-3">
                      <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                      </svg>
                      Description
                    </label>
                    <textarea
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                      className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 resize-none text-gray-900 group-hover:border-gray-300"
                      rows={4}
                      placeholder="Tell customers about this amazing product..."
                    />
                  </div>

                  {/* Price and Stock Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="group">
                      <label className="flex items-center text-sm font-bold text-gray-900 mb-3">
                        <svg className="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                        Price ($)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <span className="text-gray-500 text-lg font-bold">$</span>
                        </div>
                        <input
                          type="number"
                          step="0.01"
                          required
                          value={newProduct.price}
                          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                          className="w-full pl-10 pr-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200 text-gray-900 font-medium group-hover:border-gray-300"
                          placeholder="29.99"
                        />
                      </div>
                    </div>

                    <div className="group">
                      <label className="flex items-center text-sm font-bold text-gray-900 mb-3">
                        <svg className="w-4 h-4 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        Stock Quantity
                      </label>
                      <input
                        type="number"
                        required
                        value={newProduct.quantityInStock}
                        onChange={(e) => setNewProduct({ ...newProduct, quantityInStock: e.target.value })}
                        className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 text-gray-900 font-medium group-hover:border-gray-300"
                        placeholder="100"
                      />
                    </div>
                  </div>

                  {/* Category */}
                  <div className="group">
                    <label className="flex items-center text-sm font-bold text-gray-900 mb-3">
                      <svg className="w-4 h-4 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      Category
                    </label>
                    <div className="relative">
                      <select
                        required
                        value={newProduct.category}
                        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                        className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 text-gray-900 font-medium appearance-none bg-white group-hover:border-gray-300"
                      >
                        <option value="">Choose a category</option>
                        <option value="T-Shirts">👕 T-Shirts</option>
                        <option value="Jeans">👖 Jeans</option>
                        <option value="Hoodies">🧥 Hoodies</option>
                        <option value="Shoes">👟 Shoes</option>
                        <option value="Shirts">👔 Shirts</option>
                        <option value="Suits">🕴️ Suits</option>
                        <option value="Blazers">🧥 Blazers</option>
                        <option value="Trousers">👖 Trousers</option>
                        <option value="Shorts">🩳 Shorts</option>
                        <option value="Track Pants">👖 Track Pants</option>
                        <option value="Tank Tops">🎽 Tank Tops</option>
                        <option value="Joggers">👟 Joggers</option>
                        <option value="Denim Jackets">🧥 Denim Jackets</option>
                        <option value="Sweaters">🧶 Sweaters</option>
                        <option value="Cardigans">🧵 Cardigans</option>
                        <option value="Thermals">🔥 Thermals</option>
                        <option value="Formal Shoes">👞 Formal Shoes</option>
                        <option value="Boots">🥾 Boots</option>
                        <option value="Sandals">🩴 Sandals</option>
                        <option value="Belts">🧵 Belts</option>
                        <option value="Watches">⌚ Watches</option>
                        <option value="Hats">🎩 Hats</option>
                        <option value="Bags">🎒 Bags</option>
                        <option value="Sunglasses">🕶️ Sunglasses</option>

                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Sizes */}
                  <div className="group">
                    <label className="flex items-center text-sm font-bold text-gray-900 mb-3">
                      <svg className="w-4 h-4 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                      </svg>
                      Available Sizes
                    </label>
                    <input
                      type="text"
                      placeholder='["XS", "S", "M", "L", "XL", "XXL"]'
                      value={newProduct.sizes}
                      onChange={(e) => setNewProduct({ ...newProduct, sizes: e.target.value })}
                      className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 text-gray-900 font-medium group-hover:border-gray-300"
                    />
                    <p className="text-xs text-gray-500 mt-2">Enter sizes as a JSON array, e.g., ["S", "M", "L"]</p>
                  </div>

                  {/* Image Upload */}
                  <div className="group">
                    <label className="flex items-center text-sm font-bold text-gray-900 mb-3">
                      <svg className="w-4 h-4 mr-2 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Product Image
                    </label>
                    <div className="relative">
                      <div className="border-3 border-dashed border-gray-300 rounded-3xl p-8 hover:border-pink-400 hover:bg-pink-50/30 transition-all duration-300 group-hover:border-pink-300">
                        <div className="text-center">
                          <svg className="mx-auto h-16 w-16 text-gray-400 group-hover:text-pink-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <div className="mt-4">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => setNewProduct({ ...newProduct, imageFile: e.target.files?.[0] || null })}
                              className="sr-only"
                              id="file-upload"
                            />
                            <label
                              htmlFor="file-upload"
                              className="cursor-pointer inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl text-pink-700 bg-pink-100 hover:bg-pink-200 transition-colors"
                            >
                              Choose Image
                            </label>
                            <p className="mt-2 text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                            {newProduct.imageFile && (
                              <p className="mt-2 text-sm font-medium text-green-600">
                                ✓ {newProduct.imageFile.name}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-4 pt-6 border-t border-gray-100">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-blue-400 disabled:to-blue-500 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-200 transform hover:scale-105 disabled:scale-100 shadow-lg hover:shadow-xl disabled:shadow-md flex items-center justify-center space-x-2"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Creating Product...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          <span>Add Product</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddProduct(false)}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold py-4 px-8 rounded-2xl transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span>Cancel</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}


        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Products Management</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-6 font-semibold text-gray-900">Product</th>
                    <th className="text-left p-6 font-semibold text-gray-900">Category</th>
                    <th className="text-left p-6 font-semibold text-gray-900">Price</th>
                    <th className="text-left p-6 font-semibold text-gray-900">Stock</th>
                    <th className="text-left p-6 font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map(product => (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-6">
                        <div className="flex items-center space-x-4">
                          <img
                            src={product.imageUrl || '/api/placeholder/60/60'}
                            alt={product.name}
                            className="w-15 h-15 object-cover rounded-xl shadow-sm"
                          />
                          <div>
                            <p className="font-semibold text-gray-900">{product.name}</p>
                            <p className="text-sm text-gray-600 truncate max-w-xs">{product.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {product.category}
                        </span>
                      </td>
                      <td className="p-6">
                        <span className="font-semibold text-gray-900">${product.price}</span>
                      </td>
                      <td className="p-6">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.quantityInStock > 10
                          ? 'bg-green-100 text-green-800'
                          : product.quantityInStock > 0
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                          }`}>
                          {product.quantityInStock} in stock
                        </span>
                      </td>
                      <td className="p-6">
                        <button
                          onClick={() => deleteProduct(product.id)}
                          className="text-red-600 hover:text-red-800 font-medium text-sm transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {orders.map(order => (
              <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">Order #{order.id}</h3>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>Customer: <span className="font-medium">{order.user.name}</span></p>
                        <p>Email: <span className="font-medium">{order.user.email}</span></p>
                        <p>Date: <span className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</span></p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                      {getStatusBadge(order.status)}
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      >
                        <option value="PLACED">Placed</option>
                        <option value="PACKED">Packed</option>
                        <option value="DELIVERED">Delivered</option>
                      </select>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-6">
                    <h4 className="font-semibold text-gray-900 mb-4">Order Items</h4>
                    <div className="space-y-3">
                      {order.items.map(item => (
                        <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                          <div className="flex items-center space-x-4">
                            <img
                              src={item.product.imageUrl || '/api/placeholder/50/50'}
                              alt={item.product.name}
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                            <div>
                              <p className="font-medium text-gray-900">{item.product.name}</p>
                              <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                            </div>
                          </div>
                          <span className="font-semibold text-gray-900">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-gray-900">Total</span>
                        <span className="text-lg font-bold text-gray-900">${order.totalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};