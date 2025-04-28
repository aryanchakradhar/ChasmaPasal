import axios from 'axios';
import { createContext, useState } from 'react';
import { toast } from 'react-toastify';
import { useEffect } from 'react';

export const CartContext = createContext();
let userInfo = JSON.parse(localStorage.getItem('userInfo'));
let baseUrl = import.meta.env.VITE_APP_BASE_URL;
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        if (!userInfo) return;
        const response = await axios.get(`${baseUrl}/cart/${userInfo._id}`);
        setCartItems(response.data.items || []);
        setCartData(response.data || []);
      } catch (error) {
        console.error("Failed to fetch cart:", error);
        toast.error("Failed to load cart data");
      }
    };

    fetchCart();
  }, []);

  const addToCart = async (item) => {
    if(!userInfo) return;
    const cartData = {
      productId : item._id,
      quantity : 1
    }
    console.log("cart data", cartData);
    try {
      const response = await axios.post(`${baseUrl}/cart/${userInfo._id}`,
        cartData      
      );
      console.log("response", response);
      setCartItems(response.data.items || []);
      setCartData(response.data || [])
    } catch (error) {
      toast.error(error.response.data.error || 'Failed to add item to cart');
    }
  };

  const decreaseQuantity = async (item) => {
    if(!userInfo) return;
    const cartData = {
      productId : item._id,
      quantity : -1
    }
    try {
      const response = await axios.post(`${baseUrl}/cart/${userInfo._id}`,
        cartData
      );
      setCartItems(response.data.items || []);
      setCartData(response.data || [])
    } catch (error) {
      toast.error(error.response.data.error || 'Failed to decrease quantity');
    }
  };

  const removeFromCart = (itemToRemove) => {
    if(!userInfo) return;
    const cartData = {
      productId : itemToRemove._id
    }
    const response = axios.delete(`${baseUrl}/cart/${userInfo._id}/${itemToRemove._id}`, {
      data: cartData
    })
    setCartItems(cartItems.filter(item => item.product._id !== itemToRemove._id));
    setCartData(response.data || [])
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, setCartItems, addToCart, decreaseQuantity, removeFromCart, cartData, setCartData, cartCount }}>
      {children}
    </CartContext.Provider>
  );
};