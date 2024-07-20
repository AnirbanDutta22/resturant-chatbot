const Booking = require("../../models/booking.model");
const asyncHandler = require("../../utils/asyncHandler");
const { ApiError, ValidationError } = require("../../utils/errorHandler");
const ResponseHandler = require("../../utils/responseHandler");

//delete booking
const deleteBooking = asyncHandler(async (req, res) => {
  const { _id } = req.body;

  //checking if any field is unfilled
  if (!_id) {
    throw new ValidationError("id is required");
  }

  //checking if the Booking exists
  const incomingBooking = await Booking.findById(_id);
  if (!incomingBooking) {
    throw new ApiError(409, "Booking doesn't exist");
  }

  //removing Booking
  const booking = await Booking.findByIdAndDelete({ _id });

  //checking if the Booking removed successfully
  const removedBooking = await Booking.findById(booking._id);
  if (removedBooking) {
    throw new ApiError(500, "Something went wrong!");
  }
  return res
    .status(200)
    .json(new ResponseHandler(201, "Booking removed successfully", {}));
});

module.exports = { deleteBooking };
