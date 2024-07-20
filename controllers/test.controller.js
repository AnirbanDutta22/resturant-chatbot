const express = require("express");
const router = express.Router();

const Resturant = require("../models/resturant.model");
const ResponseHandler = require("../utils/responseHandler");
const Food = require("../models/food.model");
const Booking = require("../models/booking.model");
const User = require("../models/user.model");

const getAllResturant = async (req, res) => {
  const data = await Resturant.find();

  return res.status(200).json(new ResponseHandler(200, {}, data));
};
const deleteAllResturant = async (req, res) => {
  const data = await Resturant.deleteMany();

  return res.status(200).json(new ResponseHandler(200, {}, data));
};
const getAllFood = async (req, res) => {
  const data = await Food.find();

  return res.status(200).json(new ResponseHandler(200, {}, data));
};
const deleteAllFood = async (req, res) => {
  const data = await Food.deleteMany();

  return res.status(200).json(new ResponseHandler(200, {}, data));
};
const getAllBooking = async (req, res) => {
  const data = await Booking.find();

  return res.status(200).json(new ResponseHandler(200, {}, data));
};
const deleteAllBooking = async (req, res) => {
  const data = await Booking.deleteMany();

  return res.status(200).json(new ResponseHandler(200, {}, data));
};
const getAllUser = async (req, res) => {
  const data = await User.find();

  return res.status(200).json(new ResponseHandler(200, {}, data));
};
const deleteAllUser = async (req, res) => {
  const data = await User.deleteMany();

  return res.status(200).json(new ResponseHandler(200, {}, data));
};

module.exports = {
  getAllResturant,
  deleteAllResturant,
  getAllFood,
  deleteAllFood,
  getAllBooking,
  deleteAllBooking,
  getAllUser,
  deleteAllUser,
};
