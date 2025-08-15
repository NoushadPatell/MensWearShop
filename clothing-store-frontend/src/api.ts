import axios from 'axios';
import { type AuthResponse, type Product, type Order } from './types';

// 'http://localhost:8080/api'
const API_BASE = import.meta.env.VITE_API_BASE;

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  adminLogin: (email: string, password: string): Promise<AuthResponse> =>
    api.post('/auth/admin-login', { email, password }).then(r => r.data),
  
  googleLogin: (credential: string): Promise<AuthResponse> =>
    api.post('/auth/google-login', { idToken: credential }).then(r => r.data),

  register: (userData: {
    name: string;
    email: string;
    password: string;
    address: string;
  }): Promise<AuthResponse> =>
    api.post('/auth/register', userData).then(r => r.data),
};


export const productAPI = {
  getAll: (): Promise<Product[]> =>
    api.get('/products').then(r => r.data),
  
  getById: (id: number): Promise<Product> =>
    api.get(`/products/${id}`).then(r => r.data),
  
  create: (data: any): Promise<Product> =>
    api.post('/admin/products', data).then(r => r.data),
  
  update: (id: number, data: any): Promise<Product> =>
    api.put(`/admin/products/${id}`, data).then(r => r.data),
  
  delete: (id: number): Promise<void> =>
    api.delete(`/admin/products/${id}`),
};

export const orderAPI = {
  create: (data: any): Promise<Order> =>
    api.post('/orders', data).then(r => r.data),
  
  getUserOrders: (): Promise<Order[]> =>
    api.get('/orders/user').then(r => r.data),
  
  getAllOrders: (): Promise<Order[]> =>
    api.get('/admin/orders').then(r => r.data),
  
  updateStatus: (id: number, status: string): Promise<Order> =>
    api.patch(`/admin/orders/${id}/status`, { status }).then(r => r.data),
};
