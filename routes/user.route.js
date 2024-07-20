const express = require("express");
const router = express.Router();

//local imports
const {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeUserPassword,
} = require("../controllers/user/userAuth.controller.js");
const authHandler = require("../middlewares/common/authHandler.js");
const { getFood } = require("../controllers/user/order.controller.js");
const {
  getResturant,
  selectResturant,
  selectDate,
  bookTable,
  cancelBooking,
} = require("../controllers/user/booking.controller.js");
const chatbox = require("../controllers/interface/chatbox.controller.js");
const loginPage = require("../controllers/interface/loginpage.controller.js");

router.route("/").get(chatbox);

//auth
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(authHandler, logoutUser);
router.route("/change-password").patch(authHandler, changeUserPassword);
router.route("/refresh-token").patch(refreshAccessToken);

//order
router.route("/food").get(authHandler, getFood);

//booking
router.route("/resturant").get(authHandler, getResturant);
router
  .route("/booking")
  .post(authHandler, selectResturant, selectDate, bookTable);
router.route("/cancel-booking").post(authHandler, cancelBooking);

module.exports = router;
