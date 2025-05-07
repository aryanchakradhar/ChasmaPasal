const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    transactionId: {
      type: String,
      default: null,
      index: {
        unique: true,
        partialFilterExpression: { transactionId: { $type: "string" } },
      },
    },
    pidx: {
      type: String,
      unique: true,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "order",
      required: true,
      index: true,
    },
    amount: { type: Number, required: true },
    paymentGateway: {
      type: String,
      enum: ["cod", "khalti", "card"],
      required: true,
    },
    status: {
      type: String,
      enum: ["success", "pending", "failed"],
      default: "pending",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Payment", paymentSchema);
