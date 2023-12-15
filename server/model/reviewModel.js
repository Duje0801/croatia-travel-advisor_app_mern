const mongoose = require(`mongoose`);
const Destination = require("../model/destinationModel");

const reviewSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, `Review title is mandatory`],
    minLength: [3, `Review title must contain 3 or more characters`],
    maxLength: [
      20,
      `The maximum number of characters allowed in the review title is 20`,
    ],
  },
  text: {
    type: String,
    required: [true, `Review text is mandatory`],
    minLength: [3, `Review text must contain 3 or more characters`],
    maxLength: [
      500,
      `The maximum number of characters allowed in the Review text is 500`,
    ],
  },
  rating: {
    type: Number,
    required: [true, `Review text is mandatory`],
    min: [1, `The lowest allowed rating is 0`],
    max: [5, `The highest allowed rating is 5`],
  },
  destination: {
    name: {
      type: String,
      required: [true, `Review destination name is mandatory`],
    },
    id: {
      type: String,
      required: [true, `Review destination id is mandatory`],
    },
  },
  user: {
    username: {
      type: String,
      required: [true, `Review user name is mandatory`],
    },
    id: { type: String, required: [true, `Review user id is mandatory`] },
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

reviewSchema.statics.calcAverageRatings = async function (destinationId) {
  const newStats = await this.aggregate([
    {
      $match: { "destination.id": destinationId },
    },
    {
      $group: {
        _id: `$destination`,
        nRatings: { $sum: 1 },
        avgRating: { $avg: `$rating` },
      },
    },
  ]);

  let newStatsData = {};

  if (!newStats[0]) {
    newStatsData = {
      averageRating: 0,
      ratingQuantity: 0,
    };
  } else {
    newStatsData = {
      averageRating: newStats[0].avgRating,
      ratingQuantity: newStats[0].nRatings,
    };
  }

  await Destination.findOneAndUpdate({ _id: destinationId }, newStatsData);
};

const Review = mongoose.model(`Review`, reviewSchema);

module.exports = Review;
