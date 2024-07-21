const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");

//internal imports
const defaultErrorHandler = require("./middlewares/common/defaultErrorHandler");
const userRouter = require("./routes/user.route");
const adminRouter = require("./routes/admin.route");
const testRouter = require("./routes/test.route");

const app = express();

//request parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//set view engine
app.set("view engine", "ejs");

//set static folder
app.use(express.static(path.join(__dirname, "public")));

//parse cookies
app.use(cookieParser());

//set up routing
app.use("/", userRouter);
app.use("/admin", adminRouter);
app.use("/test", testRouter);

//errors handler
app.use(defaultErrorHandler);

module.exports = app;
