import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import api from '../services/api';
import { toast } from 'react-toastify';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (user) {
        setLoading(true);
        try {
          const res = await api.get('/api/wishlist');
          const serverItems = res.data.items || [];
          
          const localStr = localStorage.getItem('guest_wishlist');
          if (localStr) {
            const localItems = JSON.parse(localStr);
            if (localItems.length > 0) {
              const merged = mergeWishlists(serverItems, localItems);
              setWishlistItems(merged);
              await api.post('/api/wishlist', { items: merged });
              localStorage.removeItem('guest_wishlist');
            } else {
              setWishlistItems(serverItems);
            }
          } else {
            setWishlistItems(serverItems);
          }
        } catch (error) {
          console.error("Wishlist sync load failure:", error);
        } finally {
          setLoading(false);
        }
      } else {
        const local = localStorage.getItem('guest_wishlist');
        if (local) {
          setWishlistItems(JSON.parse(local));
        } else {
          setWishlistItems([]);
        }
      }
    };
    fetchWishlist();
  }, [user]);

  const syncWishlist = async (items) => {
    if (user) {
      try {
        await api.post('/api/wishlist', { items });
      } catch (err) {
        console.error("Failed to sync wishlist with db:", err);
      }
    } else {
      localStorage.setItem('guest_wishlist', JSON.stringify(items));
    }
  };

  const mergeWishlists = (server, local) => {
    const merged = [...server];
    local.forEach(lItem => {
      if (!merged.some(sItem => sItem.id === lItem.id)) {
        merged.push(lItem);
      }
    });
    return merged;
  };

  const addToWishlist = (product) => {
    if (wishlistItems.some(item => item.id === product.id)) {
      toast.info("Item already in wishlist.");
      return;
    }
    const image = product.image || product.images?.[0] || 'https://via.placeholder.com/150';
    const updated = [...wishlistItems, {
      id: product.id,
      title: product.title,
      price: parseFloat(product.price),
      discountPrice: product.discountPrice !== undefined && product.discountPrice !== null ? parseFloat(product.discountPrice) : null,
      image,
      stock: product.stock
    }];
    setWishlistItems(updated);
    syncWishlist(updated);
    toast.success(`"${product.title}" added to wishlist!`);
  };

  const removeFromWishlist = (productId) => {
    const updated = wishlistItems.filter(item => item.id !== productId);
    setWishlistItems(updated);
    syncWishlist(updated);
    toast.info("Item removed from wishlist.");
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item.id === productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlistItems, loading, addToWishlist, removeFromWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
