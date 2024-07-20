const mongoose = require("mongoose");
const validator = require("validator");

const bookingSchema = new mongoose.Schema(
  {
    booking_ID: {
      type: String,
      default: null,
      unique: true,
    },
    resturant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resturant",
      required: [true, "Enter resturant name"],
    },
    guests_No: {
      type: String,
      required: [true, "Enter the number of guests"],
    },
    time: {
      type: String,
      required: [true, "Enter time"],
    },
    date: {
      type: Date,
      required: [true, "Enter booking date"],
    },
    table_ID: [{ type: String }],
    table_count: { type: Number },
    status: {
      type: String,
      enum: ["pending", "booked", "done", "cancelled"],
    },
    booking_message: { type: String },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User not found"],
    },
  },
  { timestamps: true }
);

bookingSchema.pre("save", async function (next) {
  if (this.booking_ID !== null) return next();

  //generating unique ID for booking
  this.booking_ID = new Date();
  next();
});

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;
