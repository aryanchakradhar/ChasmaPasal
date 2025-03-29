import { Link } from 'react-router-dom'; // Assuming you're using react-router for navigation

const OrderSuccess = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-green-100">
      <h1 className="text-2xl font-bold text-green-800">Order Placed Successfully!</h1>
      <p className="mt-4 text-lg">Thank you for your purchase. Your order is being processed and will be shipped to you soon.</p>
      <Link to="/products" className="mt-6 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition duration-200">
        Continue Shopping
      </Link>
    </div>
  );
};

export default OrderSuccess;