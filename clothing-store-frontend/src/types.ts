export interface User {
  id: number;
  name: string;
  email: string;
  address?: string;
  role: 'CUSTOMER' | 'ADMIN';
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  category: string;
  imageUrl?: string;
  sizes: string;
  quantityInStock: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: number;
  product: Product;
  size: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  user: User;
  totalPrice: number;
  shippingAddress: string;
  status: 'PLACED' | 'PACKED' | 'DELIVERED';
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface CartItem {
  productId: number;
  size: string;
  quantity: number;
}

export interface CreateOrderRequest {
  shippingAddress: string;
  items: CartItem[];
}
