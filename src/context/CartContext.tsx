"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

export type CartItem = {
  id: string; // combination of slide id + size
  slideId: number;
  title: string;
  price: number;
  image: string;
  size: string;
  quantity: number;
  qikinkId: string;
};

type CartContextType = {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity' | 'id'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  totalQuantity: number;
  totalPrice: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (newItem: Omit<CartItem, 'quantity' | 'id'>) => {
    setItems((prev) => {
      const id = `${newItem.slideId}-${newItem.size}`;
      const existing = prev.find((item) => item.id === id);
      if (existing) {
        return prev.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...newItem, id, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setItems((prev) => prev.map((item) => {
      if (item.id === id) {
        const newQuantity = item.quantity + delta;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }));
  };

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  // Bundle pricing logic:
  // 5 for 3499
  // 3 for 2499
  // 1 for 1299
  const numBundlesOf5 = Math.floor(totalQuantity / 5);
  const remainderAfter5 = totalQuantity % 5;
  const numBundlesOf3 = Math.floor(remainderAfter5 / 3);
  const remainderAfter3 = remainderAfter5 % 3;

  const totalPrice = 
    (numBundlesOf5 * 3499) + 
    (numBundlesOf3 * 2499) + 
    (remainderAfter3 * 1299);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        totalQuantity,
        totalPrice,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
