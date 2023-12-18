const Destination = require("../model/destinationModel");
const Review = require(`../model/reviewModel`);
const catchAsync = require("../utilis/catchAsync");

const createReview = catchAsync(async function (req, res, next) {
  const body = req.body.data;
  const title = body.title;
  const text = body.text;
  const rating = body.rating;
  const destinationId = body.destination.id;
  const destinationName = body.destination.name;
  const userId = req.user._id;
  const userUsername = req.user.username;

  const newReview = await Review.create({
    title,
    text,
    rating,
    destination: {
      id: destinationId,
      name: destinationName,
    },
    user: {
      id: userId,
      username: userUsername,
    },
  });

  if (!newReview) {
    return res.status(404).json({
      status: `fail`,
      error: `Can't add new review`,
    });
  }

  await Review.calcAverageRatings(newReview.destination.id);

  const updatedDestination = await Destination.findById(
    newReview.destination.id
  ).populate({
    path: `reviews`,
  });

  if (!updatedDestination) {
    return res.status(404).json({
      status: `fail`,
      error: `Review is added but can't update destination info now. Please try again later.`,
    });
  }

  res.status(201).json({
    status: `success`,
    message: `Review succesfully added!`,
    data: updatedDestination,
  });
});

const updateReview = catchAsync(async function (req, res, next) {
  const body = req.body.data;
  let updatedFields = {};
  if (body.title) updatedFields = { title: body.title };
  if (body.text) updatedFields = { ...updatedFields, text: body.text };
  if (body.rating) updatedFields = { ...updatedFields, rating: body.rating };

  const getReview = await Review.findById(req.params.id);

  if (!getReview) {
    return res.status(404).json({
      status: `fail`,
      error: `Can't find review with this ID`,
    });
  }

  if (getReview.user.id !== String(req.user._id) && req.user.role !== "admin") {
    return res.status(404).json({
      status: `fail`,
      error: `You don't have permission to update this review`,
    });
  }

  const updatedReview = await Review.findByIdAndUpdate(
    req.params.id,
    {
      ...updatedFields,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  await Review.calcAverageRatings(updatedReview.destination.id);

  const updatedDestination = await Destination.findById(
    updatedReview.destination.id
  ).populate({
    path: `reviews`,
  });

  res.status(201).json({
    status: `success`,
    message: `Review succesfully edited!`,
    data: updatedDestination,
  });
});

const deleteReview = catchAsync(async function (req, res, next) {
  const getReview = await Review.findById(req.params.id);

  if (!getReview) {
    return res.status(404).json({
      status: `fail`,
      error: `Can't find review with this ID`,
    });
  }

  if (getReview.user.id !== String(req.user._id) && req.user.role !== "admin") {
    return res.status(404).json({
      status: `fail`,
      error: `You don't have permission to delete this review`,
    });
  }

  const deletedReview = await Review.findByIdAndDelete(req.params.id);

  await Review.calcAverageRatings(deletedReview.destination.id);

  const updatedDestination = await Destination.findById(
    deletedReview.destination.id
  ).populate({
    path: `reviews`,
  });

  res.status(201).json({
    status: `success`,
    message: `Review succesfully deleted!`,
    data: updatedDestination,
  });
});

module.exports = {
  createReview,
  updateReview,
  deleteReview,
};
