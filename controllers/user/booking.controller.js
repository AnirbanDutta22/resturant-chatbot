const Booking = require("../../models/booking.model");
const Resturant = require("../../models/resturant.model");
const User = require("../../models/user.model");
const asyncHandler = require("../../utils/asyncHandler");
const {
  ValidationError,
  NotFoundError,
  ApiError,
} = require("../../utils/errorHandler");
const ResponseHandler = require("../../utils/responseHandler");

//get resturant
const getResturant = asyncHandler(async (req, res) => {
  const { resturant, location, rating } = req.query;

  //get all resturants
  if (!resturant && !location && !rating) {
    const data = await Resturant.find();

    return res.status(200).json(new ResponseHandler(200, {}, data));
  }

  //get resturant by name
  if (resturant) {
    const data = await Resturant.findOne({ name: resturant });

    //checking if resturant data found
    if (!data) {
      throw new NotFoundError("Resturant not found");
    }

    return res.status(200).json(new ResponseHandler(200, {}, data));
  }

  //get resturants by location
  if (location) {
    const data = await Resturant.find({ location });

    //checking if resturant data found
    if (!data) {
      throw new NotFoundError("Resturant not found");
    }

    return res.status(200).json(new ResponseHandler(200, {}, data));
  }

  //get resturants by rating
  if (rating) {
    const data = await Resturant.find({ rating });

    //checking if resturant data found
    if (!data) {
      throw new NotFoundError("Resturant not found");
    }

    return res.status(200).json(new ResponseHandler(200, {}, data));
  }

  throw new ApiError(500, "Something went wrong");
});

//select resturant
const selectResturant = async (req, res, next) => {
  try {
    const { id } = req.query;

    //checking if id is missing
    if (!id) {
      throw new ApiError(409, "id is required");
    }

    const resturant = await Resturant.findOne({ _id: id });

    if (!resturant) {
      throw new NotFoundError("Resturant not found");
    }

    req.resturant = resturant;
    next();
  } catch (error) {
    throw new ApiError(409, error?.message);
  }
};

//select date
const selectDate = async (req, res, next) => {
  try {
    const { incomingDate, incomingTime } = req.body;

    //checking if id is missing
    if (!incomingDate || !incomingTime) {
      throw new ApiError(409, "date and time are required");
    }

    const incomingBooking = await Booking.findOne({
      resturant: req.resturant._id,
      date: incomingDate,
      time: incomingTime,
    });

    if (incomingBooking) {
      //checking if tables are available on that date & time
      if (req.resturant.total_table > req.resturant.booked_table.length) {
        req.booking = {
          date: incomingDate,
          time: incomingTime,
          resturant: req.resturant,
        };
        next();
      } else {
        return res
          .status(200)
          .json(
            new ResponseHandler(200, "No tables available on this date & time"),
            {}
          );
      }
    } else {
      req.booking = {
        date: incomingDate,
        time: incomingTime,
        resturant: req.resturant,
      };
      next();
    }
  } catch (error) {
    throw new ApiError(409, "Date selection failed");
  }
};

//book table
const bookTable = asyncHandler(async (req, res) => {
  const { guests_No } = req.body;

  //checking if no. of guests is not null
  if (!guests_No) {
    throw new ValidationError("No. of guests required");
  }

  const newBooking = await Booking.create({
    ...req.booking,
    guests_No,
    customer: req.user._id,
  });

  //checking if new booking is created successfully
  const createdBooking = await Booking.findById(newBooking._id);
  if (!createdBooking) {
    throw new ApiError(500, "Something went wrong! Booking not created");
  }

  //update booking in resturant
  const updateResturantBooking = await Resturant.findByIdAndUpdate(
    createdBooking.resturant,
    { $push: { booked_table: createdBooking._id } }
  );

  if (!updateResturantBooking) {
    throw new ApiError(500, "Something went wrong! Resturant data not updated");
  }

  //update booking in resturant
  const updateCustomerBooking = await User.findByIdAndUpdate(
    createdBooking.customer,
    { $push: { bookings: createdBooking._id } }
  );

  if (!updateCustomerBooking) {
    throw new ApiError(500, "Something went wrong! User data not updated");
  }

  return res
    .status(200)
    .json(
      new ResponseHandler(201, "New Booking added successfully", createdBooking)
    );
});

//cancel booking
const cancelBooking = asyncHandler(async (req, res) => {
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

  //checking if day of cancellation is matching with booking date
  const currentDate = new Date();
  if (incomingBooking.date.getDate() === currentDate.getDate()) {
    throw new ApiError(409, "Booking cannot be cancelled");
  }

  //removing Booking
  const booking = await Booking.findByIdAndDelete({ _id });

  //checking if the Booking removed successfully
  const removedBooking = await Booking.findById(booking._id);
  if (removedBooking) {
    throw new ApiError(500, "Something went wrong!");
  }

  //delete booking from resturant
  const updateResturantBooking = await Resturant.findByIdAndUpdate(
    incomingBooking.resturant,
    { $pull: { booked_table: incomingBooking._id } }
  );

  if (!updateResturantBooking) {
    throw new ApiError(500, "Something went wrong! Resturant data not updated");
  }

  //delete booking from customer
  const updateCustomerBooking = await User.findByIdAndUpdate(
    incomingBooking.customer,
    { $pull: { bookings: incomingBooking._id } }
  );

  if (!updateCustomerBooking) {
    throw new ApiError(500, "Something went wrong! User data not updated");
  }

  return res
    .status(200)
    .json(new ResponseHandler(201, "Booking cancelled successfully", {}));
});

module.exports = {
  getResturant,
  selectResturant,
  selectDate,
  bookTable,
  cancelBooking,
};
