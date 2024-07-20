const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    order_ID: {
      type: String,
      unique: true,
      required: [true, "Order ID required"],
    },
    foodName: [
      {
        type: String,
        required: [true, "Enter the name of food item"],
      },
    ],
    cuisine: { type: String },
    resturant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resturant",
      required: [true, "Enter resturant name"],
    },
    price: {
      type: Number,
      required: [true, "Enter the price"],
    },
    quantity: {
      type: Number,
      required: [true, "Enter the order quantity"],
    },
    total: { type: Number },
    paymentMode: {
      type: String,
      enum: ["cash on delivery", "online"],
      required: [true, "Enter the mode of payment"],
    },
    date: {
      type: Date,
      required: [true, "Enter order date"],
    },
    status: {
      type: String,
      enum: ["pending", "on the way", "cancelled", "completed", "failed"],
    },
    order_message: { type: String },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User not found"],
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
