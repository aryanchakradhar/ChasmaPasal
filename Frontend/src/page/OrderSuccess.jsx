import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(true);
  const [verified, setVerified] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [order, setOrder] = useState(null);
  const baseUrl = import.meta.env.VITE_APP_BASE_URL;
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));


  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const userId = params.get("user_id");
    const orderId = params.get("order_id");
    var orderResponse = {};

    const verifyOrder = async () => {
      if (!orderId) {
        navigate("/");
        return;
      }

      try {
        // First get order details
        const userOrdersResponse = await axios.get(
          `${baseUrl}/orders/${userId}`
        );
        userOrdersResponse.data.forEach(async (order) => {
          console.log("Order ID:", order.id, orderId);
          if (order.id === orderId) {
            console.log("Order found:", order);
            setOrder(order);
            orderResponse = order;
          }
        });

        // For COD orders
        if (orderResponse.paymentMethod === "cod") {
          setIsVerifying(false);
          setVerified(true);
          toast.success("Order confirmed! Your items will be delivered soon.");
          return;
        }

        // For Khalti payments
        const pidx = orderResponse.khaltiPidx;
        if (!pidx) {
          throw new Error("Payment reference not found");
        }

        const response = await axios.post(`${baseUrl}/khalti/verify`, {
          pidx,
          orderResponse,
          orderId,
        });
        console.log("Verification response:", response);
        if (response.data.success) {
          setVerified(true);
          toast.success("Payment verified successfully!");
        } else {
          setVerified(false);
          setErrorMessage("Payment verification failed.");
          toast.error("Payment not completed.");
        }
      } catch (error) {
        console.error("Verification error:", error);
        setVerified(false);
        setErrorMessage(
          error.message || "An error occurred while verifying payment."
        );
        toast.error("Failed to verify payment.");
      } finally {
        setIsVerifying(false);
      }
    };

    verifyOrder();
  }, [location.search, baseUrl, navigate, verified]);

  if (isVerifying) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-yellow-100">
        <p className="text-xl font-semibold text-yellow-800">
          Verifying your order, please wait...
        </p>
        <div className="w-12 h-12 mt-4 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!verified) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-red-100">
        <h1 className="text-2xl font-bold text-red-800">
          Order Verification Failed
        </h1>
        <p className="mt-4 text-lg text-red-700">{errorMessage}</p>
        <Link
          to="/"
          className="mt-6 px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition duration-200"
        >
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-green-100 p-4 text-center">
      <div className="mb-8">
        <svg
          className="w-20 h-20 text-green-500 mx-auto"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      <h1 className="text-3xl font-bold text-green-800 mb-4">
        Order Placed Successfully!
      </h1>

      {order && (
        <div className="mb-6">
          <p className="text-lg">Order #: {order._id}</p>
          <p className="text-lg">Total: Rs. {order.totalPrice}</p>
          <p className="text-lg">
            Payment Method:{" "}
            {order.paymentMethod === "cod" ? "Cash on Delivery" : "Khalti"}
          </p>
        </div>
      )}

      <p className="text-xl mb-8 max-w-lg">
        Thank you for your purchase. 
          {order?.paymentMethod === "cod" &&
          " Your items will be delivered soon."}
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          to="/orders"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          View Your Orders
        </Link>
        <Link
          to="/"
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          Continue Shopping
        </Link>
      </div>

      <p className="mt-6 text-gray-600">
        You'll be automatically redirected to the homepage in 5 seconds...
      </p>
    </div>
  );
};

export default OrderSuccess;
