const express = require("express");
const router = express.Router();

//local imports
const {
  addResturant,
  deleteResturant,
} = require("../controllers/admin/resturant.controller");
const { addFood, deleteFood } = require("../controllers/admin/food.controller");
const { deleteBooking } = require("../controllers/admin/booking.controller");

router.route("/add-resturant").post(addResturant);
router.route("/del-resturant").delete(deleteResturant);

router.route("/add-food").post(addFood);
router.route("/del-food").delete(deleteFood);

router.route("/del-booking").delete(deleteBooking);

module.exports = router;
