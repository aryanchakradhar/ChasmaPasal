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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const baseUrl =  import.meta.env.BACKEND_BASE_URL ||  import.meta.env.VITE_APP_BASE_URL;
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const [statusMap, setStatusMap] = useState({});
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
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleUpdate = async (id) => {
    const selectedStatus = statusMap[id];
    if (!selectedStatus) {
      return toast.error("Please select a status");
    }

    try {
      const response = await axios.put(`${baseUrl}/orders/${id}`, {
        status: selectedStatus,
      });
      if (response.status === 200) {
        toast.success("Order updated successfully");
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === id ? { ...order, status: selectedStatus } : order
          )
        );
      } else {
        toast.error("Failed to update order");
      }
    } catch (error) {
      toast.error("Error updating order");
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
      toast.error("Error deleting order");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return <Badge variant="success">{status}</Badge>;
      case "cancelled":
        return <Badge variant="destructive">{status}</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Order History
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {userInfo?.role === "admin"
                ? "All customer orders"
                : "Your recent orders"}
            </p>
          </div>
          {loading && (
            <div className="flex items-center gap-2 text-gray-500">
              <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-500 rounded-full animate-spin"></div>
              Loading...
            </div>
          )}
        </div>

        {orders.length === 0 && !loading ? (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              No orders found
            </h3>
            <p className="mt-1 text-gray-500 dark:text-gray-400">
              {userInfo?.role === "admin"
                ? "No orders have been placed yet"
                : "You haven't placed any orders yet"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead className="hidden md:table-cell">Amount</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Payment</TableHead>
                  <TableHead>Items</TableHead>
                  {userInfo?.role === "admin" && (
                    <TableHead className="text-right">Actions</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow
                    key={order._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <TableCell className="font-medium">
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        #{order._id.slice(-6).toUpperCase()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{order.shippingAddress.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 md:hidden">
                        {order.shippingAddress.address}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell font-medium">
                      Rs {order.totalPrice.toFixed(2)}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {formatDate(order.createdAt)}
                    </TableCell>
                    <TableCell>
                      {userInfo?.role === "admin" ? (
                        <Select
                          defaultValue={order.status}
                          onValueChange={(value) =>
                            setStatusMap({ ...statusMap, [order._id]: value })
                          }
                        >
                          <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        getStatusBadge(order.status)
                      )}
                    </TableCell>
                    <TableCell className="hidden md:table-cell capitalize">
                      {order.paymentMethod}
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[200px] truncate">
                        {order.items.map((item, index) => (
                          <div
                            key={index}
                            className="text-sm text-gray-600 dark:text-gray-300"
                          >
                            {item?.product?.name || "Unknown Product"} ×{" "}
                            {item.quantity}
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    {userInfo?.role === "admin" && (
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleUpdate(order._id)}
                          >
                            Update
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(order._id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Orders;
