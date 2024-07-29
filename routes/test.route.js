const express = require("express");
const router = express.Router();

//local imports
const {
  getAllResturant,
  deleteAllResturant,
  deleteAllFood,
  getAllFood,
  getAllBooking,
  deleteAllBooking,
  getAllUser,
  deleteAllUser,
} = require("../controllers/test.controller");

router.route("/get-all-user").get(getAllUser);
router.route("/del-all-user").delete(deleteAllUser);
router.route("/get-all-resturant").get(getAllResturant);
router.route("/del-all-resturant").delete(deleteAllResturant);
router.route("/get-all-food").get(getAllFood);
router.route("/del-all-food").delete(deleteAllFood);
router.route("/get-all-booking").get(getAllBooking);
router.route("/del-all-booking").delete(deleteAllBooking);

module.exports = router;
