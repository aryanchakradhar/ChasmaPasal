import { useEffect, useState } from 'react';
import CheckoutForm from '@/components/forms/CheckoutForm';
import OrderSummary from '@/components/OrderSummary';
import PaymentSection from '@/components/PaymentSection';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const baseUrl = import.meta.env.VITE_APP_BASE_URL;
  const userInfo = JSON.parse(localStorage.getItem("userInfo"))
  const [cartData, setCartData] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!userInfo) return;
    const fetchCart = async () => {
      try {
        const response = await axios.get(`${baseUrl}/cart/${userInfo._id}`);
        console.log(response.data || [])
        setCartData(response.data || []);
      } catch (error) {
        toast.error(error.response?.data.error || "Failed to fetch cart data");
      }
    };
    fetchCart();
  }, []);
  const [formData, setFormData] = useState({
    paymentMethod: 'cod',
    name:  `${userInfo.firstName}  ${userInfo.lastName}` || '',
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
        toast.success('Order placed successfully!');
        navigate('/ordersuccess')
      } else {
        toast.error('Failed to place order.');
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      toast.error('An error occurred during checkout.');
    }
  };

  return (
    
    <div className="min-h-screen bg-gray-100 dark:bg-black flex items-center justify-center">
      {
        !cartData?(
          <h2>
            loading...
          </h2>
        ) : (
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 w-full max-w-4xl">
          <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Checkout</h1>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CheckoutForm setFormData={setFormData} formData={formData}/>
            <div>
              <OrderSummary cartData={cartData}/>
              <PaymentSection setFormData={setFormData} formData={formData}/>
              <button
                type="submit"
                className={`mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900  ${cartData && cartData.items && cartData.items.length > 0? 'opacity-100' : 'opacity-50 cursor-not-allowed'}`}
                disabled = {!(cartData && cartData.items && cartData.items.length > 0)}
              >
                Buy Now
              </button>
            </div>
          </form>
        </div>
        )
      }
    </div>
  );
}

export default Checkout;
