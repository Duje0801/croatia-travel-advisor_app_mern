const Destination = require(`../model/destinationModel`);
const catchAsync = require("../utilis/catchAsync");

const getOneDestination = catchAsync(async function (req, res, next) {
  const destination = await Destination.find({
    name: req.params.id,
  }).populate({
    path: `reviews`,
  });

  if (!destination) {
    return res.status(404).json({
      status: `fail`,
      error: `Can't find destination with this name`,
    });
  }

  res.status(200).json({
    status: `success`,
    data: destination,
  });
});

const getCategory = catchAsync(async function (req, res, next) {
  let destinationFind = Destination.find();
  let count = 0;

  if (req.params.id === `topRated`) {
    destinationFind = Destination.find({
      ratingQuantity: { $gte: 3 },
    })
      .sort(`-averageRating -ratingQuantity`)
      .limit(3);
  } else if (req.params.id === `trending`) {
    destinationFind = Destination.find({
      ratingQuantity: { $gte: 3 },
    })
      .sort(`-ratingQuantity -averageRating`)
      .limit(3);
  } else if (
    req.params.id === `history` ||
    req.params.id === `towns` ||
    req.params.id === `nature` ||
    req.params.id === `entertainment`
  ) {
    count = await Destination.countDocuments({
      category: req.params.id,
    }).count();

    const skip = ((req.query.page * 1 || 1) - 1) * 5;

    destinationFind = Destination.find({
      category: req.params.id,
    })
      .sort(`-ratingQuantity -averageRating`)
      .skip(skip)
      .limit(5);
  } else if (req.params.id) {
    return res.status(404).json({
      status: `fail`,
      error: `Category don't exist`,
    });
  }

  const destination = await destinationFind;

  if (!destination[0]) {
    return res.status(404).json({
      status: `fail`,
      error: `Can't find any destination`,
    });
  }

  res.status(200).json({
    status: `success`,
    quantity: count || destination.length,
    data: destination,
  });
});

const createDestination = catchAsync(async function (req, res, next) {
  const name = req.body.name;
  const description = req.body.description;
  const image = req.body.image;
  const category = req.body.category;

  const newDestination = await Destination.create({
    name,
    description,
    image,
    category,
  });

  res.status(201).json({ status: `success`, destination: newDestination });
});

const updateDestination = catchAsync(async function (req, res, next) {
  let updatedFields = {};
  if (req.body.description)
    updatedFields = { ...updatedFields, description: req.body.description };
  if (req.body.image)
    updatedFields = { ...updatedFields, image: req.body.image };
  if (req.body.category)
    updatedFields = { ...updatedFields, category: req.body.category };

  const updatedDestination = await Destination.findOneAndUpdate(
    { name: req.params.id },
    { ...updatedFields },
    {
      new: true,
      runValidators: true,
    }
  ).populate({
    path: `reviews`,
  });

  if (!updatedDestination) {
    return res.status(404).json({
      status: `fail`,
      error: `Can't find destination with this name`,
    });
  }

  res.status(201).json({
    status: `success`,
    data: updatedDestination,
  });
});

const deleteDestination = catchAsync(async function (req, res, next) {
  const deletedDestination = await Destination.findOneAndDelete({
    name: req.params.id,
  });

  if (!deletedDestination) {
    return res.status(404).json({
      status: `fail`,
      error: `Can't find destination with this name`,
    });
  }

  res.status(201).json({
    status: `success`,
    message: `Destination succesfully deleted!`,
  });
});

const searchDestination = catchAsync(async function (req, res, next) {
  const destinations = await Destination.find({
    name: { $regex: new RegExp(req.params.id, "i") },
  })
    .select(`name`)
    .sort(`-ratingQuantity`)
    .limit(3);

  res.status(200).json({
    status: `success`,
    destinations,
  });
});

module.exports = {
  getOneDestination,
  getCategory,
  createDestination,
  updateDestination,
  deleteDestination,
  searchDestination,
};
