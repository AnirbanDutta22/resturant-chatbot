const Food = require("../../models/food.model");
const Resturant = require("../../models/resturant.model");
const asyncHandler = require("../../utils/asyncHandler");
const {
  ValidationError,
  ApiError,
  NotFoundError,
} = require("../../utils/errorHandler");
const ResponseHandler = require("../../utils/responseHandler");

//get food
const getFood = asyncHandler(async (req, res) => {
  const { food, tags, cuisine, resturant } = req.query;

  //checking if all of these fields are unfilled
  if (!food && !tags && !cuisine && !resturant) {
    const data = await Food.find();

    return res.status(200).json(new ResponseHandler(200, {}, data));
  }

  //get food by name
  if (food) {
    const data = await Food.findOne({ name: food });

    //checking if food data found
    if (!data) {
      throw new NotFoundError("Food not found");
    }

    return res.status(200).json(new ResponseHandler(200, {}, data));
  }

  //get food by tags
  if (tags) {
    const data = await Food.find({ tags });

    //checking if food data found
    if (!data) {
      throw new NotFoundError("Food not found");
    }

    return res.status(200).json(new ResponseHandler(200, {}, data));
  }

  //get food by cuisine
  if (cuisine) {
    const data = await Food.find({ cuisine });

    //checking if food data found
    if (!data) {
      throw new NotFoundError("Food not found");
    }

    return res.status(200).json(new ResponseHandler(200, {}, data));
  }

  //get food by resturant
  if (resturant) {
    const data = await Resturant.findOne({ name: resturant });

    //checking if resturant data found
    if (!data) {
      throw new NotFoundError("Resturant not found");
    }

    //checking if food is available
    if (data.menu.length === 0) {
      return res
        .status(200)
        .json(
          new ResponseHandler(
            200,
            "Currently no food available at the resturant",
            {}
          )
        );
    }

    return res.status(200).json(
      new ResponseHandler(
        200,
        {},
        {
          resturant: data.name,
          menu: data.menu,
          description: data.description,
          tableCount: data.total_table,
          rating: data.rating,
          location: data.location,
        }
      )
    );
  }

  throw new ApiError(500, "Something went wrong");
});

//place order
const orderFood = asyncHandler(async (req, res) => {});

//cancel order

module.exports = { getFood, orderFood };
