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
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Shopping Cart</h2>
      {cartItems?.length > 0 ? (
        cartItems.map((item, index) => (
          <div key={index} className="flex justify-between mb-2">
            <div>
              <Link to={`/product/${item.product._id}`}>
                <h3 className="font-bold">{item.product.name}</h3>
              </Link>
              <p>Price: ${item.product.price}</p>
              <div className="flex items-center">
                <p>Quantity: </p>
                <button
                  onClick={() => decreaseQuantity(item.product)}
                  className={`mx-2 bg-red-500 text-white px-2 rounded ${
                    item.quantity === 1
                      ? "opacity-50 cursor-not-allowed"
                      : "opacity-100"
                  }`}
                  disabled={item.quantity === 1}
                >
                  -
                </button>
                <p>{item.quantity}</p>
                <button
                  onClick={() => addToCart(item.product)}
                  className="mx-2 bg-green-500 text-white px-2 rounded"
                >
                  +
                </button>
              </div>
            </div>
            <div>
              <button
                onClick={() => handleRemove(item.product)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Remove
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>Your cart is empty</p>
      )}
      <div className="flex justify-between mt-4">
        <h2 className="text-xl font-bold">Total</h2>
        <p>${cartData.bill?.toFixed(2) || 0}</p>
      </div>

      <Link to="/checkout">
        <button className="bg-blue-500 text-white px-4 py-2 rounded mt-4">
          Proceed to Checkout
        </button>
      </Link>
    </div>
  );
};

export default Cart;
