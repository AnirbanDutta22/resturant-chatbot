const Resturant = require("../../models/resturant.model");
const asyncHandler = require("../../utils/asyncHandler");
const { ValidationError, ApiError } = require("../../utils/errorHandler");
const ResponseHandler = require("../../utils/responseHandler");

//add resturant
const addResturant = asyncHandler(async (req, res) => {
  const { name, total_table, location } = req.body;

  //checking if any field is unfilled
  if (!name || !total_table || !location) {
    throw new ValidationError("All fields are required");
  }

  //checking if the resturant already exists
  const existingResturant = await Resturant.findOne({ name, location });
  if (existingResturant) {
    throw new ApiError(409, "Same resturant already exists");
  }

  //creating new resturant entry
  const newResturant = await Resturant.create(req.body);

  //checking if the resturant created successfully
  const createdResturant = await Resturant.findById(newResturant._id);
  if (!createdResturant) {
    throw new ApiError(500, "Something went wrong!");
  }
  return res
    .status(200)
    .json(
      new ResponseHandler(
        201,
        "New Resturant added successfully",
        createdResturant
      )
    );
});

//delete resturant
const deleteResturant = asyncHandler(async (req, res) => {
  const { name, _id } = req.body;

  //checking if any field is unfilled
  if (!name || !_id) {
    throw new ValidationError("All fields are required");
  }

  //checking if the resturant exists
  const incomingResturant = await Resturant.findOne({ name, _id });
  if (!incomingResturant) {
    throw new ApiError(409, "Resturant doesn't exist");
  }

  //removing resturant
  const resturant = await Resturant.findByIdAndDelete({ _id });

  //checking if the resturant removed successfully
  const removedResturant = await Resturant.findById(resturant._id);
  if (removedResturant) {
    throw new ApiError(500, "Something went wrong!");
  }
  return res
    .status(200)
    .json(new ResponseHandler(201, "Resturant removed successfully", {}));
});

module.exports = { addResturant, deleteResturant };
