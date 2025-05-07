const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, "Quantity cannot be less than 1"],
        },
        priceAtPurchase: {
          type: Number,
        },
        nameAtPurchase: {
          type: String,
        },
      },
    ],
    paymentMethod: {
      type: String,
      enum: ["cod", "card"],
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: [0, "Total price cannot be negative"],
    },
    shippingAddress: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String },
      zip: { type: String, required: true },
      phone: { type: String },
    },
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "failed",
        "refunded",
      ],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    khaltiData: {
      type: Object,
    },
    khaltiPidx: {
      type: String,
      index: true,
    },
    trackingNumber: {
      type: String,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for formatted order number
OrderSchema.virtual("orderNumber").get(function () {
  return `ORD-${this._id.toString().slice(-8).toUpperCase()}`;
});

// Indexes
OrderSchema.index({ userId: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ paymentStatus: 1 });
OrderSchema.index({ createdAt: -1 });
OrderSchema.index({ "shippingAddress.email": 1 });

// Pre-save hook to calculate total if not provided
OrderSchema.pre("save", function (next) {
  if (this.isModified("items") && !this.totalPrice) {
    this.totalPrice = this.items.reduce((total, item) => {
      return total + item.priceAtPurchase * item.quantity;
    }, 0);
  }
  next();
});

module.exports = mongoose.model("Order", OrderSchema);
