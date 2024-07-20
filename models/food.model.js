const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Enter food name"],
    },
    food_ID: {
      type: String,
      default: null,
      unique: true,
    },
    cuisine: {
      type: String,
    },
    tags: [{ type: String }],
    description: { type: String },
    image_URL: { type: String },
  },
  { timestamps: true }
);

foodSchema.pre("save", async function (next) {
  if (this.food_ID !== null) return next();

  //generating unique ID for food
  const firstChar = this.name.charAt(0);
  const countNo =
    (await Food.countDocuments({
      name: { $regex: new RegExp(`^${firstChar}`, "i") },
    })) + 1;
  this.food_ID =
    countNo.toString().padStart(3, 0) + "#" + firstChar.toUpperCase();
  next();
});

const Food = mongoose.model("Food", foodSchema);
module.exports = Food;
