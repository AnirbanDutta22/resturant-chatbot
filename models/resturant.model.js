const mongoose = require("mongoose");

const resturantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Enter resturant name"],
    },
    resturant_ID: {
      type: String,
      default: null,
      unique: true,
    },
    menu: [
      {
        food: { type: mongoose.Schema.Types.ObjectId, ref: "Food" },
        price: { type: Number, required: [true, "Enter price"] },
        rating: {
          type: Number,
          min: 1,
          max: 5,
          default: null,
        },
        rating_count: { type: Number },
      },
    ],
    description: { type: String },
    image_URL: { type: String },
    total_table: { type: Number, required: true },
    booked_table: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
      },
    ],
    rating: {
      type: Number,
      default: null,
      max: 5,
      min: 1,
    },
    rating_count: { type: Number },
    location: { type: String, required: true },
  },
  { timestamps: true }
);

resturantSchema.pre("save", async function (next) {
  if (this.resturant_ID !== null) return next();

  //generating unique ID for resturant
  const firstChar = this.name.charAt(0);
  const countNo =
    (await Resturant.countDocuments({
      name: { $regex: new RegExp(`^${firstChar}`, "i") },
    })) + 1;
  this.resturant_ID =
    countNo.toString().padStart(3, 0) + "#" + firstChar.toUpperCase();
  next();
});

const Resturant = mongoose.model("Resturant", resturantSchema);
module.exports = Resturant;
