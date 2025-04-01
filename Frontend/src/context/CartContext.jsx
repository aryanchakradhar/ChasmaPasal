import axios from 'axios';
import { createContext, useState } from 'react';
import { toast } from 'react-toastify';

export const CartContext = createContext();
let userInfo = JSON.parse(localStorage.getItem('userInfo'));
let baseUrl = import.meta.env.VITE_APP_BASE_URL;
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartData, setCartData] = useState([]);

  const addToCart = async (item) => {
    if(!userInfo) return;
    const cartData = {
      productId : item._id,
      quantity : 1
    }
    try {
      const response = await axios.post(`${baseUrl}/cart/${userInfo._id}`,
        cartData
      );
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

  return (
    <CartContext.Provider value={{ cartItems, setCartItems, addToCart, decreaseQuantity, removeFromCart, cartData, setCartData }}>
      {children}
    </CartContext.Provider>
  );
};