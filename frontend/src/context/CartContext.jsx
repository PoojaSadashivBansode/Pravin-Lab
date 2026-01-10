import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [initialized, setInitialized] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('labCart');
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        setCartItems(parsed);
      } catch (error) {
        console.error('Error loading cart:', error);
      }
    }
    setInitialized(true);
  }, []);

  // Save cart to localStorage whenever it changes (after initialization)
  useEffect(() => {
    if (initialized) {
      localStorage.setItem('labCart', JSON.stringify(cartItems));
    }
  }, [cartItems, initialized]);

  const addToCart = (item, type = 'test') => {
    // Check if item already exists
    const existingItem = cartItems.find(
      (i) => i.id === item._id && i.type === type
    );

    if (existingItem) {
      toast.error('Item already in cart');
      return;
    }

    const cartItem = {
      id: item._id,
      name: item.name,
      price: item.discountPrice || item.price,
      originalPrice: item.price,
      type, // 'test' or 'package'
      description: item.description,
      category: item.category,
      reportTime: item.reportTime,
      sampleType: item.sampleType,
      testsCount: type === 'package' ? item.tests?.length : undefined
    };

    setCartItems([...cartItems, cartItem]);
    toast.success(`${item.name} added to cart`);
  };

  const removeFromCart = (itemId) => {
    setCartItems(cartItems.filter((item) => item.id !== itemId));
    toast.success('Item removed from cart');
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('labCart');
    toast.success('Cart cleared');
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price, 0);
  };

  const getCartCount = () => {
    return cartItems.length;
  };

  const getSavings = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.originalPrice - item.price);
    }, 0);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartCount,
    getSavings
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContext;
