import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const fetchWishlist = async () => {
    if (!isAuthenticated) {
      setWishlistItems([]);
      return;
    }
    setIsLoading(true);
    try {
      const response = await api.get('/wishlist');
      setWishlistItems(response.data.wishlist || []);
    } catch (err) {
      console.error("Error fetching wishlist items:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch wishlist automatically when authenticated state changes
  useEffect(() => {
    fetchWishlist();
  }, [isAuthenticated]);

  // Add item to wishlist
  const addToWishlist = async (productId) => {
    if (!isAuthenticated) return { success: false, error: 'Please login to save items' };
    try {
      await api.post('/wishlist', { product_id: productId });
      await fetchWishlist(); // Re-sync
      return { success: true };
    } catch (err) {
      console.error("Add to wishlist failed:", err);
      return { success: false, error: err.response?.data?.message || 'Failed to add item to wishlist' };
    }
  };

  // Remove item from wishlist
  const removeFromWishlist = async (productId) => {
    if (!isAuthenticated) return { success: false };
    try {
      // Optimistic update
      setWishlistItems(prev => prev.filter(item => item.product_id !== productId));
      await api.delete(`/wishlist/${productId}`);
      return { success: true };
    } catch (err) {
      console.error("Remove from wishlist failed:", err);
      fetchWishlist(); // Re-sync
      return { success: false };
    }
  };

  // Check if a specific product is in wishlist
  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item.product_id === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        isLoading,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        refreshWishlist: fetchWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
