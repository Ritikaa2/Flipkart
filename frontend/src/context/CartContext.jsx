import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const fetchCart = async () => {
    if (!isAuthenticated) {
      setCartItems([]);
      return;
    }
    setIsLoading(true);
    try {
      const response = await api.get('/cart');
      setCartItems(response.data.cart || []);
    } catch (err) {
      console.error("Error fetching cart items:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch cart automatically when authentication state changes
  useEffect(() => {
    fetchCart();
  }, [isAuthenticated]);

  // Add item to cart
  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated) return { success: false, error: 'Please login to add items to cart' };
    try {
      await api.post('/cart', { product_id: productId, quantity });
      await fetchCart(); // Re-fetch to sync
      return { success: true };
    } catch (err) {
      console.error("Add to cart api failed:", err);
      return { success: false, error: err.response?.data?.message || 'Failed to add item to cart' };
    }
  };

  // Update item quantity
  const updateCartQuantity = async (cartItemId, quantity) => {
    try {
      // Optimistic local state update for snappy UI feel
      setCartItems(prev =>
        prev.map(item => item.id === cartItemId ? { ...item, quantity } : item)
      );

      await api.put(`/cart/${cartItemId}`, { quantity });
      return { success: true };
    } catch (err) {
      console.error("Update quantity failed, rolling back:", err);
      fetchCart(); // Re-sync with backend on failure
      return { success: false, error: 'Failed to update quantity' };
    }
  };

  // Remove item from cart
  const removeFromCart = async (cartItemId) => {
    try {
      // Optimistic local update
      setCartItems(prev => prev.filter(item => item.id !== cartItemId));
      await api.delete(`/cart/${cartItemId}`);
      return { success: true };
    } catch (err) {
      console.error("Remove from cart failed, rolling back:", err);
      fetchCart(); // Re-sync
      return { success: false, error: 'Failed to remove item' };
    }
  };

  // Clear local cart state
  const clearCart = () => {
    setCartItems([]);
  };

  // Computed properties
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalMrp = cartItems.reduce((acc, item) => acc + (parseFloat(item.mrp) * item.quantity), 0);
  const finalAmount = cartItems.reduce((acc, item) => acc + (parseFloat(item.price) * item.quantity), 0);
  const totalDiscount = totalMrp - finalAmount;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isLoading,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        refreshCart: fetchCart,
        totalItems,
        totalMrp,
        totalDiscount,
        finalAmount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
