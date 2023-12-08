const Review = require(`../model/reviewModel`);
const catchAsync = require("../utilis/catchAsync");

const createReview = catchAsync(async function (req, res, next) {
  const text = req.body.text;
  const rating = req.body.rating;
  const destination = `6571a79800ebf5febf06dcbb`;
  const user = req.user._id;

  const newReview = await Review.create({
    text,
    rating,
    destination,
    user,
  });

  Review.calcAverageRatings(destination);

  res.status(201).json({ status: `success`, review: newReview });
});

const updateReview = catchAsync(async function (req, res, next) {
  let updatedFields = {};
  if (req.body.text) updatedFields = { text: req.body.text };
  if (req.body.rating)
    updatedFields = { ...updatedFields, rating: req.body.rating };

  const getReview = await Review.findOne({ _id: req.params.id });

  if (!getReview) {
    return res.status(404).json({
      status: `fail`,
      error: `Can't find destination with this ID`,
    });
  }

  if (getReview.user !== String(req.user._id) && req.user.role !== "admin") {
    return res.status(404).json({
      status: `fail`,
      error: `You don't have permission to update this review`,
    });
  }

  const updatedReview = await Review.findOneAndUpdate(
    { _id: req.params.id },
    {
      ...updatedFields,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  Review.calcAverageRatings(updatedReview.destination);

  res.status(201).json({ status: `success`, review: updatedReview });
});

const deleteReview = catchAsync(async function (req, res, next) {
  const getReview = await Review.findOne({ _id: req.params.id });

  if (!getReview) {
    return res.status(404).json({
      status: `fail`,
      error: `Can't find destination with this ID`,
    });
  }

  if (getReview.user !== String(req.user._id) && req.user.role !== "admin") {
    return res.status(404).json({
      status: `fail`,
      error: `You don't have permission to delete this review`,
    });
  }

  const deletedReview = await Review.findOneAndDelete({ _id: req.params.id });

  Review.calcAverageRatings(deletedReview.destination);

  res
    .status(201)
    .json({ status: `success`, message: `Review succesfully deleted!` });
});

module.exports = {
  createReview,
  updateReview,
  deleteReview,
};
