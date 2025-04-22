import { CartContext } from "@/context/CartContext";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const Cart = () => {
  const {
    cartItems,
    setCartItems,
    removeFromCart,
    addToCart,
    decreaseQuantity,
    cartData,
    setCartData,
  } = useContext(CartContext);
  const baseUrl = import.meta.env.VITE_APP_BASE_URL;
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    if (!userInfo) return;
    const fetchCart = async () => {
      try {
        const response = await axios.get(`${baseUrl}/cart/${userInfo._id}`);
        setCartData(response.data || {});
        setCartItems(response.data.items || []);
      } catch (error) {
        toast.error(error.response?.data.error || "Failed to fetch cart data");
      }
    };
    fetchCart();
  }, [setCartItems]);

  const handleRemove = (item) => {
    removeFromCart(item);
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg max-w-4xl mx-auto">
      {cartItems?.length > 0 ? (
        cartItems.map((item, index) => (
          <div key={index} className="flex justify-between items-center mb-6 p-4 border-b">
            <div className="flex items-center gap-6">
              {/* Product Image */}
              <img
                src={`http://localhost:8080${item.product.image}`}
                alt={item.product.name}
                className="w-20 h-20 object-cover rounded-md"
              />
              <div>
                <Link to={`/product/${item.product._id}`} className="text-xl font-semibold text-gray-800 hover:text-indigo-600">
                  {item.product.name}
                </Link>
                <p className="text-gray-600">Price: Rs {item.product.price}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Quantity Control */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => decreaseQuantity(item.product)}
                  className={`bg-red-500 text-white px-3 py-1 rounded-full transition duration-300 ease-in-out hover:bg-red-600 ${item.quantity === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                  disabled={item.quantity === 1}
                >
                  -
                </button>
                <span className="text-lg font-medium">{item.quantity}</span>
                <button
                  onClick={() => addToCart(item.product)}
                  className="bg-green-500 text-white px-3 py-1 rounded-full transition duration-300 ease-in-out hover:bg-green-600"
                >
                  +
                </button>
              </div>

              {/* Remove Button */}
              <button
                onClick={() => handleRemove(item.product)}
                className="bg-red-500 text-white px-4 py-2 rounded-full transition duration-300 ease-in-out hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-lg text-gray-600">Your cart is empty</p>
      )}

      {/* Total & Checkout Section */}
      <div className="flex justify-between items-center mt-6 border-t pt-4">
        <h2 className="text-2xl font-semibold text-gray-800">Total</h2>
        <p className="text-2xl font-semibold text-gray-800">
          Rs {cartData.bill?.toFixed(2) || 0}
        </p>
      </div>

      <Link to="/checkout" className="w-full">
        <button className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-lg transition duration-300 ease-in-out hover:bg-indigo-700">
          Proceed to Checkout
        </button>
      </Link>
    </div>
  );
};

export default Cart;
