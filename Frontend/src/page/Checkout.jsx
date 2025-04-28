import { useEffect, useState } from 'react';
import CheckoutForm from '@/components/forms/CheckoutForm';
import OrderSummary from '@/components/OrderSummary';
import PaymentSection from '@/components/PaymentSection';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const baseUrl = import.meta.env.VITE_APP_BASE_URL;
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const [cartData, setCartData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
      return;
    }
    
    const fetchCart = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${baseUrl}/cart/${userInfo._id}`);
        setCartData(response.data || []);
      } catch (error) {
        toast.error(error.response?.data.error || "Failed to fetch cart data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCart();
  }, []);

  const [formData, setFormData] = useState({
    paymentMethod: '',
    name: `${userInfo.firstName} ${userInfo.lastName}` || '',
    email: userInfo.email || "",
    address: '',
    city: '',
    zip: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    const data = {
      shippingAddress: {
        name: formData.name,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        zip: formData.zip,
      },
      items: cartData.items.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
      })),
      totalPrice: cartData.bill,
      userId: userInfo._id,
      paymentMethod: formData.paymentMethod
    };
    
    try {
      const response = await axios.post(`${baseUrl}/orders`, data);
      if (response.status === 200) {
        if(formData.paymentMethod === "cod"){
          navigate('/ordersuccess');
          toast.success('Order placed successfully!');
        }
      } else {
        toast.error('Failed to place order.');
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      toast.error('An error occurred during checkout.');
    }
  };

  const validateForm = () => {
    const { name, email, address, city, zip, paymentMethod } = formData;
    
    if (!name || !email || !address || !city || !zip) {
      toast.error("Please fill in all the shipping details.");
      return false;
    }

    if (!paymentMethod) {
      toast.error("Please select a payment method.");
      return false;
    }

    if (!cartData || !cartData.items || cartData.items.length === 0) {
      toast.error("Your cart is empty.");
      return false;
    }
    
    return true;
  };

  const paymentIntegrate = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    try {
      const response = await fetch(`${baseUrl}/khalti/payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: cartData.bill, 
          order_id: cartData._id,
          purchase_order_name: cartData.items[0]?.product?.brand || "Order",
        })
      });

      const data = await response.json();
      if (response.status === 200) {
        window.location.href = data.payment_url || data.message;
      } else {
        toast.error(data.message || "Failed to initiate Khalti payment.");
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while connecting to Khalti.");
    }
  };

  const renderPaymentButton = () => {
    const baseClasses = "mt-6 w-full py-4 rounded-xl shadow-lg transition-all duration-300 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2";
    
    if (formData.paymentMethod === 'cod') {
      return (
        <button
          type="submit"
          onClick={handleSubmit}
          className={`${baseClasses} bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:ring-green-400 text-white ${
            cartData?.items?.length > 0 ? 'opacity-100' : 'opacity-50 cursor-not-allowed'
          }`}
          disabled={!(cartData?.items?.length > 0)}
        >
          Place Order (Cash on Delivery)
        </button>
      );
    } else if (formData.paymentMethod === 'card') {
      return (
        <button
          onClick={paymentIntegrate}
          className={`${baseClasses} bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:ring-purple-400 text-white ${
            cartData?.items?.length > 0 ? 'opacity-100' : 'opacity-50 cursor-not-allowed'
          }`}
          disabled={!(cartData?.items?.length > 0)}
        >
          Pay with Khalti
        </button>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Loading your cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">Secure Checkout</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">Complete your purchase with confidence</p>
        </div>
        
        {!cartData || cartData.items?.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
            <div className="max-w-md mx-auto">
              <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h2 className="mt-6 text-2xl font-bold text-gray-900 dark:text-white">Your cart is empty</h2>
              <p className="mt-2 text-gray-600 dark:text-gray-300">Add some products to your cart before checkout</p>
              <button
                onClick={() => navigate('/')}
                className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition duration-300"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
              <div className="p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Order Summary</h2>
                <OrderSummary cartData={cartData} />
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                <div className="p-6 sm:p-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Shipping Information</h2>
                  <CheckoutForm setFormData={setFormData} formData={formData} />
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                <div className="p-6 sm:p-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Payment Method</h2>
                  <PaymentSection setFormData={setFormData} formData={formData} />
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                <div className="p-6 sm:p-8">
                  {renderPaymentButton()}
                  <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center">
                    Your personal data will be used to process your order and support your experience throughout this website.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
