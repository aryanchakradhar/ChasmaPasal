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
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo) return;
    const fetchCart = async () => {
      try {
        const response = await axios.get(`${baseUrl}/cart/${userInfo._id}`);
        setCartData(response.data || []);
      } catch (error) {
        toast.error(error.response?.data.error || "Failed to fetch cart data");
      }
    };
    fetchCart();
  }, []);

  const [formData, setFormData] = useState({
    paymentMethod: '',
    name: `${userInfo.firstName}  ${userInfo.lastName}` || '',
    email: userInfo.email || "",
    address: '',
    city: '',
    zip: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
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
  console.log(formData.paymentMethod);
  const paymentIntegrate = async () => {
    // Validate form fields
  const { name, email, address, city, zip } = formData;

  if (!name || !email || !address || !city || !zip) {
    toast.error("Please fill in all the shipping details.");
    return;
  }

  if (!cartData || !cartData.items || cartData.items.length === 0) {
    toast.error("Your cart is empty.");
    return;
  }
    try {
      const response = await fetch(`${baseUrl}/khalti/payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: cartData.bill,
          order_id: cartData._id,
          purchase_order_name: cartData.items[0].product.brand,
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
    if (formData.paymentMethod === 'cod') {
      return (
        <button
          type="submit"
          className={`mt-6 w-full bg-green-600 text-white py-3 rounded-lg shadow-md transition duration-300 ease-in-out hover:bg-green-700 focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${cartData?.items?.length > 0 ? 'opacity-100' : 'opacity-50 cursor-not-allowed'}`}
          disabled={!(cartData?.items?.length > 0)}
        >
          Buy Now
        </button>
      );
    } else if (formData.paymentMethod === 'card') {
      return (
        <button
          type="submit"
          onClick={paymentIntegrate}
          className={`mt-6 w-full bg-purple-600 text-white py-3 rounded-lg shadow-md transition duration-300 ease-in-out hover:bg-purple-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${cartData?.items?.length > 0 ? 'opacity-100' : 'opacity-50 cursor-not-allowed'}`}
          disabled={!(cartData?.items?.length > 0)}
        >
          Buy with Khalti
        </button>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black flex items-center justify-center">
      {!cartData ? (
        <div className="text-center text-lg text-gray-500">Loading...</div>
      ) : (
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-8 w-full max-w-4xl">
          <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Checkout</h1>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <CheckoutForm setFormData={setFormData} formData={formData} />
            <div className="space-y-6">
              <OrderSummary cartData={cartData} />
              <PaymentSection setFormData={setFormData} formData={formData} />
              {renderPaymentButton()}
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Checkout;
