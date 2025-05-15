import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const OrderStatus = () => {
  const baseUrl =  import.meta.env.BACKEND_BASE_URL ||  import.meta.env.VITE_APP_BASE_URL;
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState("pending");

  useEffect(() => {
    const checkOrderStatus = async () => {
      try {
        const searchParams = new URLSearchParams(location.search);
        const orderId =
          searchParams.get("purchase_order_id") ||
          localStorage.getItem("currentOrder");

        if (!orderId) {
          navigate("/");
          return;
        }

        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        console.log("Search params:", userInfo._id);

        const khaltiStatus = searchParams.get("status");
        // Check URL params for payment status
        if (khaltiStatus === "Completed") {
          setPaymentStatus("success");
        } else {
          setPaymentStatus("failed");
        }

        console.log("Order ID:", orderId);
        const userOrders = await axios.get(`${baseUrl}/orders/${userInfo._id}`);
        console.log("Order data:", userOrders.data);

        userOrders.data.forEach(async (order) => {
          console.log("Order ID:", order.id, orderId);
          if (order.id === orderId) {
            console.log("Order found:", order);
            setOrder(order);
            if (khaltiStatus === "Completed") {
              console.log("Order response:", order);
              setTimeout(() => {
                navigate(
                  `/ordersuccess/?user_id=${userInfo._id}&order_id=${orderId}`
                );
              }, 3000);
            }
          }
        });

        console.log("Updated data:", order);

        // Clear stored order ID
        localStorage.removeItem("currentOrder");
      } catch (error) {
        console.error("Order status error:", error);
        toast.error(
          error.response?.data?.message || "Failed to fetch order status"
        );
        setTimeout(() => navigate("/"), 3000);
      } finally {
        setLoading(false);
      }
    };

    checkOrderStatus();
  }, [location, navigate, baseUrl]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-4 text-lg">Loading your order status...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Order Status</h1>

      {order ? (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Order #{order._id}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p>
                  <span className="font-medium">Status:</span>
                  <span
                    className={`ml-2 px-2 py-1 rounded ${
                      order.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : order.status === "failed"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </p>
                <p>
                  <span className="font-medium">Payment:</span>
                  <span
                    className={`ml-2 px-2 py-1 rounded ${
                      order.paymentStatus === "paid"
                        ? "bg-green-100 text-green-800"
                        : order.paymentStatus === "failed"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {order.paymentStatus}
                  </span>
                </p>
              </div>
              <div>
                <p>
                  <span className="font-medium">Total:</span> Rs.{" "}
                  {order.totalPrice}
                </p>
                <p>
                  <span className="font-medium">Date:</span>{" "}
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {paymentStatus === "success" ? (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-green-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">
                    Your payment was successful! You'll be redirected shortly...
                  </p>
                </div>
              </div>
            </div>
          ) : paymentStatus === "failed" ? (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">
                    Payment failed. Please try again or contact support.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-blue-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    Your order is being processed. Please wait...
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6">
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-lg">Order not found</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Return to Home
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderStatus;
