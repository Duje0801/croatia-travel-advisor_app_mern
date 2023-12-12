const Destination = require(`../model/destinationModel`);
const catchAsync = require("../utilis/catchAsync");

const getDestination = catchAsync(async function (req, res, next) {
  let destinationFind = Destination.find();

  if (req.url === `/category/topRated`) {
    destinationFind = Destination.find({
      ratingQuantity: { $gte: 3 },
    })
      .sort(`-averageRating -ratingQuantity`)
      .limit(3);
  }

  if (req.url === `/category/trending`) {
    destinationFind = Destination.find({
      ratingQuantity: { $gte: 3 },
    })
      .sort(`-ratingQuantity -averageRating`)
      .limit(3);
  }

  if (req.params.id) {
    destinationFind = Destination.find({ _id: req.params.id }).populate({
      path: `reviews`,
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
    quantity: destination.length,
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
  if (req.body.name) updatedFields = { name: req.body.name };
  if (req.body.description)
    updatedFields = { ...updatedFields, description: req.body.description };
  if (req.body.image)
    updatedFields = { ...updatedFields, image: req.body.image };
  if (req.body.category)
    updatedFields = { ...updatedFields, category: req.body.category };

  const updatedDestination = await Destination.findOneAndUpdate(
    { _id: req.params.id },
    { ...updatedFields },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedDestination) {
    return res.status(404).json({
      status: `fail`,
      error: `Can't find destination with this ID`,
    });
  }

  res.status(201).json({
    status: `success`,
    destination: updatedDestination,
  });
});

const deleteDestination = catchAsync(async function (req, res, next) {
  const deletedDestination = await Destination.findOneAndDelete({
    _id: req.params.id,
  });

  if (!deletedDestination) {
    return res.status(404).json({
      status: `fail`,
      error: `Can't find destination with this ID`,
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
  getDestination,
  createDestination,
  updateDestination,
  deleteDestination,
  searchDestination,
};
