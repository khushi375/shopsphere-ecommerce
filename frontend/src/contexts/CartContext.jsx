import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import api from '../services/api';
import { toast } from 'react-toastify';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Sync cart session when authentication state changes
  useEffect(() => {
    const fetchCart = async () => {
      if (user) {
        setLoading(true);
        try {
          const res = await api.get('/api/cart');
          const serverItems = res.data.items || [];
          
          // Merge local guest cart items with server cart items if they exist
          const localCartStr = localStorage.getItem('guest_cart');
          if (localCartStr) {
            const localItems = JSON.parse(localCartStr);
            if (localItems.length > 0) {
              const merged = mergeCarts(serverItems, localItems);
              setCartItems(merged);
              await api.post('/api/cart', { items: merged });
              localStorage.removeItem('guest_cart');
              toast.success("Guest items merged with your account!");
            } else {
              setCartItems(serverItems);
            }
          } else {
            setCartItems(serverItems);
          }
        } catch (error) {
          console.error("Cart sync load failure:", error);
        } finally {
          setLoading(false);
        }
      } else {
        // Load local guest items from localStorage
        const localCart = localStorage.getItem('guest_cart');
        if (localCart) {
          setCartItems(JSON.parse(localCart));
        } else {
          setCartItems([]);
        }
      }
    };
    fetchCart();
  }, [user]);

  // Utility helper to persist updates locally or remotely
  const syncCart = async (items) => {
    if (user) {
      try {
        await api.post('/api/cart', { items });
      } catch (err) {
        console.error("Failed to sync cart updates with db:", err);
      }
    } else {
      localStorage.setItem('guest_cart', JSON.stringify(items));
    }
  };

  const mergeCarts = (server, local) => {
    const merged = [...server];
    local.forEach(lItem => {
      const match = merged.find(sItem => sItem.id === lItem.id);
      if (match) {
        match.quantity += lItem.quantity;
      } else {
        merged.push(lItem);
      }
    });
    return merged;
  };

  const addToCart = (product, quantity = 1) => {
    let updated;
    const existingIndex = cartItems.findIndex(item => item.id === product.id);
    const availableStock = product.stock !== undefined ? product.stock : 99;
    
    if (existingIndex > -1) {
      updated = [...cartItems];
      const newQty = updated[existingIndex].quantity + quantity;
      if (newQty > availableStock) {
        updated[existingIndex].quantity = availableStock;
        toast.warning(`Adjusted quantity to ${availableStock} (maximum stock).`);
      } else {
        updated[existingIndex].quantity = newQty;
      }
    } else {
      const image = product.image || product.images?.[0] || 'https://via.placeholder.com/150';
      updated = [...cartItems, {
        id: product.id,
        title: product.title,
        price: parseFloat(product.price),
        discountPrice: product.discountPrice !== undefined && product.discountPrice !== null ? parseFloat(product.discountPrice) : null,
        quantity: Math.min(quantity, availableStock),
        image,
        stock: availableStock
      }];
    }
    
    setCartItems(updated);
    syncCart(updated);
    toast.success(`"${product.title}" added to cart!`);
  };

  const removeFromCart = (productId) => {
    const updated = cartItems.filter(item => item.id !== productId);
    setCartItems(updated);
    syncCart(updated);
    toast.info("Item removed from cart.");
  };

  const updateQuantity = (productId, quantity) => {
    const updated = cartItems.map(item => {
      if (item.id === productId) {
        const qty = Math.min(Math.max(1, quantity), item.stock);
        if (qty === item.stock && quantity >= item.stock) {
          toast.warning("Maximum product availability reached.");
        }
        return { ...item, quantity: qty };
      }
      return item;
    });
    setCartItems(updated);
    syncCart(updated);
  };

  const clearCart = () => {
    setCartItems([]);
    syncCart([]);
  };

  // Aggregators
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cartItems.reduce((acc, item) => {
    const activePrice = item.discountPrice !== null ? item.discountPrice : item.price;
    return acc + (activePrice * item.quantity);
  }, 0);

  return (
    <CartContext.Provider value={{ cartItems, loading, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
