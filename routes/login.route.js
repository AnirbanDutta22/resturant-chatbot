const express = require("express");
const loginPage = require("../controllers/interface/loginpage.controller");
const registerPage = require("../controllers/interface/registerpage.controller");
const router = express.Router();

router.route("/").get(loginPage);
router.route("/register").get(registerPage);

module.exports = router;
