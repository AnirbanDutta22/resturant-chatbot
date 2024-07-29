const jwt = require("jsonwebtoken");
//local imports
const { ApiError, ValidationError } = require("../../utils/errorHandler");
const ResponseHandler = require("../../utils/responseHandler");
const asyncHandler = require("../../utils/asyncHandler");
const User = require("../../models/user.model");

//access token refresh token generating utility method
const generateTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Access token, Refresh token generating failed !");
  }
};

//register page
const registerPage = async (req, res) => {
  res.render("register", { errors: undefined });
};

//register user
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phoneNum } = req.body;
  const errors = {};

  //checking if any field is unfilled
  if (!name || !password || !email || !phoneNum) {
    errors.validationError = "All fields required";
    return res.render("register", { errors: errors });
  }

  //checking if the user already exists
  const existingUser = await User.findOne({
    $or: [{ email: email }, { phoneNum: phoneNum.toString() }],
  });
  if (existingUser) {
    errors.validationError = "User already exists !";
    return res.render("register", { errors: errors });
  }

  //creating new user
  const user = await User.create({
    name,
    email,
    phoneNum: phoneNum.toString(),
    password,
  });

  //checking if user is created successfully
  const createdUser = await User.findById(user._id).select("-password");
  if (!createdUser) {
    errors.validationError = "Something went wrong ! User not registered !";
    return res.render("register", { errors: errors });
  }

  res.status(200);

  res.redirect("/");
});

//login page
const loginPage = async (req, res) => {
  res.render("index", { errors: undefined });
};

//login user
const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const errors = {};

  //checking if any field is unfilled
  if (!email || !password) {
    errors.validationError = "All fields required !";
    return res.render("index", { errors: errors });
  }

  //checking if the user exists or not
  const user = await User.findOne({ email });
  if (!user) {
    errors.validationError = "User not exists ! Please Register !";
    return res.render("index", { errors: errors });
  }

  //checking if given password is valid
  const isPasswordValid = await user.isValidPassword(password);
  if (!isPasswordValid) {
    errors.validationError = "Invalid user login credentials !";
    return res.render("index", { errors: errors });
  }

  //generate tokens
  const { accessToken, refreshToken } = await generateTokens(user._id);

  //fetching logged in user
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  //configuring cookie options
  const options = {
    httpOnly: true,
    secure: true,
    expires: new Date(Date.now() + 60 * 60 * 24 * 1000),
  };

  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options);

  res.redirect("/user");
});

//logout user
const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: false,
  };

  res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options);

  res.redirect("/");
});

//refresh access token
const refreshAccessToken = asyncHandler(async (req, res) => {
  try {
    const incomingRefreshToken =
      req.cookies?.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
      throw new ApiError(401, "Unauthorized request");
    }

    //verifiying token
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    //finding user
    const user = await User.findById(decodedToken?._id);

    //checking if user exists
    if (!user) {
      throw new ApiError(401, "Access token not found");
    }

    //checking if both refresh token matches
    if (incomingRefreshToken !== user.refreshToken) {
      throw new ApiError(401, "Invalid access token");
    }

    //generate new tokens
    const { accessToken, refreshToken } = await generateTokens(user._id);

    const options = {
      httpOnly: true,
      secure: true,
      expires: new Date(Date.now() + 60 * 60 * 24 * 1000),
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(new ResponseHandler(201, "Access token refreshed successfully"));
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

//change user password
const changeUserPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  //checking if user entered existing password correct
  const user = await User.findById(req.user?._id);
  const isPasswordValid = user.isValidPassword(oldPassword);

  if (!isPasswordValid) {
    throw new ApiError(400, "Invalid old password");
  }

  user.password = newPassword;
  user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ResponseHandler(200, "Password changed successfully"));
});

module.exports = {
  registerPage,
  registerUser,
  loginPage,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeUserPassword,
};
