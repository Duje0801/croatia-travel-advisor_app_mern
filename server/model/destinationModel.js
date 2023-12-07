const mongoose = require(`mongoose`);

const destinationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, `Destination name is mandatory`],
    unique: [
      true,
      `the destination must have a unique name
        `,
    ],
    minLength: [3, `The destination name must contain 3 or more characters`],
    maxLength: [
      20,
      `The maximum number of characters allowed in the destination name is 20`,
    ],
  },
  description: {
    type: String,
    required: [true, `Destination description is mandatory`],
    minLength: [
      20,
      `The destination description must contain 20 or more characters`,
    ],
    maxLength: [
      500,
      `The maximum number of characters allowed in the destination name is 500`,
    ],
  },
  image: {
    type: String,
    required: [true, `Destination image is mandatory`],
    maxLength: [
      500,
      `The maximum number of characters allowed in the destination name is 500`,
    ],
  },
  averageRating: {
    type: Number,
    default: 0,
  },
  ratingQuantity: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Destination = mongoose.model(`Destination`, destinationSchema);

module.exports = Destination;
