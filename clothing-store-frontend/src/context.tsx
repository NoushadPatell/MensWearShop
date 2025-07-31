import React, { createContext, useContext, useEffect, useState } from 'react';
import { type User, type Product, type CartItem } from './types';

interface AppContextType {
  user: User | null;
  isAuthenticated: boolean;
  cart: (CartItem & { product: Product })[];
  login: (token: string, user: User) => void;
  logout: () => void;
  addToCart: (product: Product, size: string, quantity: number) => void;
  removeFromCart: (productId: number, size: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<(CartItem & { product: Product })[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const login = (token: string, userData: User) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setCart([]);
  };

  const addToCart = (product: Product, size: string, quantity: number) => {
    setCart(prev => {
      const existing = prev.find(item => 
        item.productId === product.id && item.size === size
      );
      
      if (existing) {
        return prev.map(item =>
          item.productId === product.id && item.size === size
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      return [...prev, { productId: product.id, size, quantity, product }];
    });
  };

  const removeFromCart = (productId: number, size: string) => {
    setCart(prev => prev.filter(item => 
      !(item.productId === productId && item.size === size)
    ));
  };

  const clearCart = () => setCart([]);

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  return (
    <AppContext.Provider value={{
      user,
      isAuthenticated: !!user,
      cart,
      login,
      logout,
      addToCart,
      removeFromCart,
      clearCart,
      getCartTotal,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
