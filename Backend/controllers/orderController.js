const Cart = require("../models/cart");
const Order = require("../models/order");

const createOrder = async (req, res) => {
  try {
    const { userId, items, paymentMethod, totalPrice, shippingAddress } =
      req.body;
    if (!req.body.items.every((item) => item.product)) {
      return res
        .status(400)
        .send({ message: "Each item must include a productId." });
    }
    const newOrder = new Order({
      userId,
      items,
      paymentMethod,
      totalPrice,
      shippingAddress,
    });

    const savedOrder = await newOrder.save();
    //remove items from cart
    await Cart.findOneAndDelete({ userId });
    res.status(200).json(savedOrder);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create order" });
  }
};

// Get orders
const getOrders = async (req, res) => {
  const id = req.params.id;
  try {
    const orders = await Order.find({ userId: id }).populate("items.product");
    res.status(200).send(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal server error." });
  }
};

const updateOrder = async (req, res) => {
  const id = req.params.id;
  const status = req.body.status;
  try {
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).send({ message: "Order not found." });
    }
    order.status = status;
    await order.save();
    return res.status(200).send({ message: "Order updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update order" });
  }
};

// get all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("items.product");
    res.status(200).send(orders);
  } catch (error) {
    res.status(500).send({ message: "Internal server error." });
  }
};

const deleteOrder = async (req, res) => {
  const id = req.params.id;
  try {
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).send({ message: "Order not found." });
    }
    await Order.findOneAndDelete(id);
    return res.status(200).send({ message: "Order deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete order" });
  }
};

module.exports = {
  createOrder,
  getOrders,
  updateOrder,
  getAllOrders,
  deleteOrder,
};
