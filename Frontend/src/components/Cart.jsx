import { CartContext } from "@/context/CartContext";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react"; 

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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!userInfo) return;
    const fetchCart = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${baseUrl}/cart/${userInfo._id}`);
        setCartData(response.data || {});
        setCartItems(response.data.items || []);
      } catch (error) {
        toast.error(error.response?.data.error || "Failed to fetch cart data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCart();
  }, [setCartItems]);

  const handleRemove = (item) => {
    removeFromCart(item);
    toast.success(`${item.name} removed from cart`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Shopping Cart</h1>
      
      {cartItems?.length > 0 ? (
        <div className="bg-white shadow-lg rounded-xl overflow-hidden flex flex-col" style={{ maxHeight: 'calc(100vh - 200px)' }}>
          {/* Scrollable Cart Items */}
          <div className="divide-y divide-gray-200 overflow-y-auto flex-1">
            {cartItems.map((item, index) => (
              <div key={index} className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 hover:bg-gray-50 transition-colors">
                {/* Product Info */}
                <div className="flex items-center gap-6 flex-1 min-w-0">
                  <Link to={`/product/${item.product._id}`} className="shrink-0">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                    />
                  </Link>
                  <div className="min-w-0">
                    <Link 
                      to={`/product/${item.product._id}`} 
                      className="text-lg font-semibold text-gray-800 hover:text-indigo-600 transition-colors truncate block"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-indigo-600 font-medium mt-2">Rs {item.product.price}</p>
                  </div>
                </div>

                {/* Quantity Control */}
                <div className="flex items-center gap-4 sm:ml-auto">
                  <div className="flex items-center border border-gray-300 rounded-full">
                    <button
                      onClick={() => decreaseQuantity(item.product)}
                      className={`px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-l-full transition ${item.quantity === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                      disabled={item.quantity === 1}
                    >
                      <Minus className="h-5 w-5" />
                    </button>
                    <span className="px-3 py-1 text-gray-800 font-medium">{item.quantity}</span>
                    <button
                      onClick={() => addToCart(item.product)}
                      className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-r-full transition"
                    >
                      <Plus className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemove(item.product)}
                    className="text-red-500 hover:text-red-700 transition-colors p-2"
                    title="Remove item"
                  >
                    <Trash2 className="h-6 w-6" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Fixed Summary Section at Bottom */}
          <div className="bg-gray-50 p-6 border-t border-gray-200 sticky bottom-0">
            <div className="max-w-md mx-auto space-y-6">
              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span>Rs {cartData.bill?.toFixed(2) || 0}</span>
              </div>

              <div className="pt-2 space-y-4">
                <Link 
                  to="/checkout" 
                  className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white text-center py-3 px-6 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg"
                >
                  Proceed to Checkout
                </Link>
                <Link 
                  to="/products" 
                  className="block w-full text-center text-indigo-600 hover:text-indigo-800 py-2 px-6 font-medium transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow-lg rounded-xl p-12 text-center">
          <ShoppingCart className="h-16 w-16 mx-auto text-gray-400" />
          <h2 className="text-2xl font-medium text-gray-700 mt-4">Your cart is empty</h2>
          <p className="text-gray-500 mt-2">Looks like you haven't added anything to your cart yet</p>
          <Link 
            to="/products" 
            className="mt-6 inline-block bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-lg font-medium transition-colors"
          >
            Browse Products
          </Link>
        </div>
      )}
    </div>
  );
};

export default Cart;
