import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const baseUrl = import.meta.env.VITE_APP_BASE_URL;
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const [status, setStatus] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        const response = await axios.get(`${baseUrl}/orders`);
        setOrders(response.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch orders");
        setLoading(false);
      }
    };

    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${baseUrl}/orders/${userInfo._id}`);
        setOrders(response.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch orders");
        setLoading(false);
      }
    };

    if (userInfo?.role === "admin") {
      fetchAllOrders();
    } else {
      fetchOrders();
    }
  }, []);

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleUpdate = async (id) => {
    if (!status) {
      return toast.error("Please select a status");
    }
    try {
      const response = await axios.put(`${baseUrl}/orders/${id}`, { status });
      if (response.status === 200) {
        toast.success("Order updated successfully");
      } else {
        toast.error("Failed to update order");
      }
    } catch (error) {
      toast.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${baseUrl}/orders/${id}`);
      if (response.status === 200) {
        toast.success("Order deleted successfully");
        setOrders(orders.filter((order) => order._id !== id));
      } else {
        toast.error("Failed to delete order");
      }
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div className="px-5 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">Orders</h1>
        {loading && <div className="text-gray-500">Loading...</div>}
      </div>

      {orders.length === 0 && !loading ? (
        <div className="text-center text-lg text-gray-500">No orders available</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>User Name</TableHead>
              <TableHead className="hidden md:table-cell">Address</TableHead>
              <TableHead className="hidden md:table-cell">Total Price</TableHead>
              <TableHead className="hidden md:table-cell">Created At</TableHead>
              <TableHead className="hidden md:table-cell">Status</TableHead>
              <TableHead className="hidden md:table-cell">Payment Method</TableHead>
              <TableHead>Products</TableHead>
              {userInfo?.role === "admin" && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order._id} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                <TableCell>{order._id}</TableCell>
                <TableCell>{order.shippingAddress.name}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {order.shippingAddress.address}
                </TableCell>
                <TableCell className="hidden md:table-cell">Rs{order.totalPrice}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {formatDate(order.createdAt)}
                </TableCell>
                <TableCell>
                  {userInfo?.role === "admin" ? (
                    <select
                      defaultValue={order.status}
                      className="bg-transparent dark:bg-gray-700 dark:text-white p-2 rounded-md focus:outline-none"
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  ) : (
                    order.status
                  )}
                </TableCell>
                <TableCell className="hidden md:table-cell">{order.paymentMethod}</TableCell>
                <TableCell>
                  <ul>
                    {order.items.map((item) => (
                      <li key={item._id}>
                        - {item?.product?.name || "Unknown Product"} ({item.quantity})
                      </li>
                    ))}
                  </ul>
                </TableCell>
                {userInfo?.role === "admin" && (
                  <TableCell className="flex gap-2">
                    <button
                      className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                      onClick={() => handleUpdate(order._id)}
                    >
                      Update
                    </button>
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                      onClick={() => handleDelete(order._id)}
                    >
                      Delete
                    </button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default Orders;
