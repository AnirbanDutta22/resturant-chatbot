const Food = require("../../models/food.model");
const asyncHandler = require("../../utils/asyncHandler");
const { ValidationError, ApiError } = require("../../utils/errorHandler");
const ResponseHandler = require("../../utils/responseHandler");

//add food
const addFood = asyncHandler(async (req, res) => {
  const { name } = req.body;

  //checking if any field is unfilled
  if (!name) {
    throw new ValidationError("All fields are required");
  }

  //checking if the food already exists
  const existingFood = await Food.findOne({ name });
  if (existingFood) {
    throw new ApiError(409, "Same food already exists");
  }

  //creating new Food entry
  const newFood = await Food.create(req.body);

  //checking if the Food created successfully
  const createdFood = await Food.findById(newFood._id);
  if (!createdFood) {
    throw new ApiError(500, "Something went wrong!");
  }
  return res
    .status(200)
    .json(new ResponseHandler(201, "New Food added successfully", createdFood));
});

//delete food
const deleteFood = asyncHandler(async (req, res) => {
  const { name, _id } = req.body;

  //checking if any field is unfilled
  if (!name || !_id) {
    throw new ValidationError("All fields are required");
  }

  //checking if the Food exists
  const incomingFood = await Food.findOne({ name, _id });
  if (!incomingFood) {
    throw new ApiError(409, "Food doesn't exist");
  }

  //removing Food
  const food = await Food.findByIdAndDelete({ _id });

  //checking if the Food removed successfully
  const removedFood = await Food.findById(food._id);
  if (removedFood) {
    throw new ApiError(500, "Something went wrong!");
  }
  return res
    .status(200)
    .json(new ResponseHandler(201, "Food removed successfully", {}));
});

module.exports = { addFood, deleteFood };
