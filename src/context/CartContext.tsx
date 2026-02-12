import React, { createContext, useContext, useState, ReactNode } from 'react';
import { MenuItem, SugarOption, SpiceLevel } from '@/data/menuData';

export interface CartItem extends MenuItem {
  quantity: number;
  sugarOption?: SugarOption;
  spiceLevel?: SpiceLevel;
  cartItemId: string; // Unique ID for cart (combines item.id + customization option)
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: MenuItem, quantity: number, sugarOption?: SugarOption, spiceLevel?: SpiceLevel) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (item: MenuItem, quantity: number, sugarOption?: SugarOption, spiceLevel?: SpiceLevel) => {
    // Generate unique cart ID based on available customization
    const customization = spiceLevel || sugarOption || 'default';
    const cartItemId = `${item.id}-${customization}`;

    setItems(prevItems => {
      const existingItem = prevItems.find(i => i.cartItemId === cartItemId);
      if (existingItem) {
        return prevItems.map(i =>
          i.cartItemId === cartItemId ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prevItems, { ...item, quantity, sugarOption, spiceLevel, cartItemId }];
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setItems(prevItems => prevItems.filter(i => i.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setItems(prevItems =>
      prevItems.map(i => (i.cartItemId === cartItemId ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalPrice = () => {
    // Round to 2 decimal places to prevent floating-point arithmetic errors
    return Math.round(items.reduce((total, item) => total + item.price * item.quantity, 0) * 100) / 100;
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalPrice,
        getTotalItems,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};