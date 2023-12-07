const mongoose = require(`mongoose`);
const Destination = require("../model/destinationModel");

const reviewSchema = new mongoose.Schema({
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
  destination: String,
  user: String,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

reviewSchema.statics.calcAverageRatings = async function (destinationId) {
  const newStats = await this.aggregate([
    {
      $match: { destination: destinationId },
    },
    {
      $group: {
        _id: `$destination`,
        nRatings: { $sum: 1 },
        avgRating: { $avg: `$rating` },
      },
    },
  ]);

  await Destination.findOneAndUpdate(
    { _id: destinationId },
    {
      averageRating: newStats[0].avgRating,
      ratingQuantity: newStats[0].nRatings,
    }
  );
};

const Review = mongoose.model(`Review`, reviewSchema);

module.exports = Review;