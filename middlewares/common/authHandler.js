const jwt = require("jsonwebtoken");
const { ApiError } = require("../../utils/errorHandler");
const User = require("../../models/user.model");

const authHandler = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];

    if (!token) {
      throw new ApiError(401, "Unauthorized request! Token not found!");
    }

    //verifying token with jwt
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    //finding the user
    const user = await User.findById(decodedToken?._id);

    //checking if user exists
    if (!user) {
      throw new ApiError(401, "Invalid access token !");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
};

module.exports = authHandler;
