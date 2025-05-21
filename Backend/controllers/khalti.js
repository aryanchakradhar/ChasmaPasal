const axios = require("axios");
const dotenv = require("dotenv");
const Order = require("../models/order");
const Payment = require("../models/payment");
const Cart = require("../models/cart");

dotenv.config();

const KHALTI_HEADERS = {
  Authorization: `Key ${process.env.KHALTI_SECRET_KEY.trim()}`,
  "Content-Type": "application/json",
};

const createOrderForPayment = async (req, res, next) => {
  try {
    const { userId, items, totalPrice, shippingAddress } = req.body;
    console.log("Order for payment:", req.body);

    // Check for existing pending order for the same cart
    const existingOrder = await Order.findOne({
      userId,
      status: "pending",
      "items.product": { $in: items?.map((i) => i.product) },
    });

    if (existingOrder) {
      console.log("existingOrder", existingOrder);
      if (existingOrder.paymentMethod != "card") {
        return res.status(400).json({
          success: false,
          message: "Pending order already exists for these items.",
        });
      } else {
        const updatedOrder = await Order.findByIdAndUpdate(
          existingOrder.id,
          {
            items: items,
            totalPrice: totalPrice,
            shippingAddress: shippingAddress,
          },
          { new: true }
        );
        req.order = updatedOrder;
        console.log("req.order", req.order);
        next();
      }
    } else {
      console.log("Creating order for payment:", req.body);

      const newOrder = new Order({
        userId,
        items,
        paymentMethod: "card",
        totalPrice,
        shippingAddress,
        status: "pending",
        paymentStatus: "pending",
      });

      const savedOrder = await newOrder.save();
      req.order = savedOrder;
      next();
    }
  } catch (error) {
    console.error("Order creation error:", error);
    return res.status(500).json({
      success: false,
      message: "Order creation failed",
      error: error.message,
    });
  }
};

const initializeKhaltiPayment = async (req, res) => {
  try {
    const order = req.order;
    const totalAmount = Math.round(order.totalPrice * 100);

    if (totalAmount < 100) {
      return res.status(400).json({
        success: false,
        message: "Minimum payment amount is NPR 1.00",
      });
    }

    console.log(
      "Initializing Khalti payment for order:",
      order.id,
      order.totalPrice
    );

    const payload = {
      return_url: `${process.env.FRONTEND_URL}/orderstatus`,
      website_url: process.env.FRONTEND_URL,
      amount: totalAmount,
      purchase_order_id: order._id,
      purchase_order_name: `Order-${order._id.toString().slice(-6)}`,
      customer_info: {
        name: order.shippingAddress.name,
        email: order.shippingAddress.email,
        phone: order.shippingAddress.phone || "9800000000",
      },
    };

    console.log("Payload", payload);

    const response = await axios.post(
      `${process.env.KHALTI_GATEWAY_URL}/epayment/initiate/`,
      payload,
      { headers: KHALTI_HEADERS }
    );

    console.log("initiate response", response);

    const { pidx, payment_url } = response.data;

    // Check for existing pending payment
    const existingPayment = await Payment.findOne({
      orderId: order._id,
    });

    console.log("existingPayment", order._id, order);
    if (existingPayment) {
      console.log("existing payment", existingPayment);
      await Payment.findByIdAndUpdate(existingPayment._id, {
        amount: order.totalPrice,
        pidx,
        status: "pending",
      });
    } else {
      await Payment.create({
        orderId: order._id,
        amount: order.totalPrice,
        pidx,
        paymentGateway: "khalti",
        status: "pending",
      });
    }

    await Order.findByIdAndUpdate(order._id, {
      khaltiPidx: pidx,
      khaltiData: response.data,
    });

    return res.status(200).json({
      success: true,
      payment_url,
      pidx,
      orderId: order._id,
    });
  } catch (error) {
    console.error("Khalti initialization error:", error);

    if (req.order?._id) {
      await Order.findByIdAndUpdate(req.order._id, {
        status: "failed",
        paymentStatus: "failed",
      });
    }

    const errorMessage =
      error.response?.data?.detail ||
      error.response?.data?.error ||
      error.message;

    return res.status(500).json({
      success: false,
      message: "Payment initialization failed",
      error: errorMessage,
    });
  }
};

const verifyKhaltiPayment = async (req, res) => {
  try {
    const { pidx, orderResponse, orderId } = req.body;

    if (!pidx) {
      return res.status(400).json({
        success: false,
        message: "Payment reference (pidx) is required",
      });
    }

    const verification = await axios.post(
      `${process.env.KHALTI_GATEWAY_URL}/epayment/lookup/`,
      { pidx },
      { headers: KHALTI_HEADERS }
    );

    console.log("Payment verification response:", verification);

    const { status, transaction_id } = verification.data;

    if (status !== "Completed") {
      await Order.findByIdAndUpdate(orderId, {
        status: "failed",
        paymentStatus: "failed",
      });

      await Payment.findOneAndUpdate({ pidx }, { status: "failed" });

      return res.status(400).json({
        success: false,
        message: `Payment not completed. Status: ${status}`,
        orderId: orderId,
      });
    }

    // Process successful payment
    await Promise.all([
      Order.findByIdAndUpdate(
        orderId,
        {
          status: "delivered",
          paymentStatus: "paid",
          paymentMethod: "card",
        },
        { new: true }
      ),
      Payment.findOneAndUpdate(
        { pidx },
        {
          transactionId: transaction_id,
          status: "success",
          paymentDate: new Date(),
        }
      ),
      Cart.findOneAndUpdate(
        { userId: orderResponse.userId },
        { $set: { items: [], bill: 0 } }
      ),
    ]);

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      orderId: orderResponse.id,
      transactionId: transaction_id,
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    return res.status(500).json({
      success: false,
      message: "Payment verification failed",
      error: error.message,
    });
  }
};

const khaltiWebhook = async (req, res) => {
  try {
    const { pidx, status, transaction_id, purchase_order_id } = req.query;

    if (!pidx || !status || !purchase_order_id) {
      console.warn("Invalid webhook call - missing parameters");
      return res.redirect(
        `${process.env.FRONTEND_URL}/orderstatus?error=invalid_parameters`
      );
    }

    if (status === "Completed") {
      const order = await Order.findByIdAndUpdate(purchase_order_id, {
        status: "completed",
        paymentStatus: "paid",
        paymentMethod: "card",
      });

      if (order) {
        await Cart.findOneAndUpdate(
          { userId: order.userId },
          { $set: { items: [], bill: 0 } }
        );
      }

      await Payment.findOneAndUpdate(
        { pidx },
        {
          transactionId: transaction_id,
          status: "success",
          paymentDate: new Date(),
        }
      );

      return res.redirect(
        `${process.env.FRONTEND_URL}/orderstatus?success=true&order_id=${purchase_order_id}`
      );
    } else {
      await Order.findByIdAndUpdate(purchase_order_id, {
        status: "failed",
        paymentStatus: "failed",
      });

      await Payment.findOneAndUpdate(
        { pidx },
        {
          status: "failed",
          transactionId: transaction_id || null,
        }
      );

      return res.redirect(
        `${process.env.FRONTEND_URL}/orderstatus?status=failed&order_id=${purchase_order_id}`
      );
    }
  } catch (error) {
    console.error("Webhook processing error:", error);
    return res.redirect(
      `${process.env.FRONTEND_URL}/orderstatus?error=processing_error`
    );
  }
};

module.exports = {
  createOrderForPayment,
  initializeKhaltiPayment,
  verifyKhaltiPayment,
  khaltiWebhook,
};
