const mongoose = require(`mongoose`);
const validator = require(`validator`);

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, `Username is mandatory`],
      unique: [true, `Username is already in use`],
      minLength: [3, `Username must contain 3 or more characters`],
      maxLength: [
        15,
        `The maximum number of characters allowed in username is 15`,
      ],
    },
    email: {
      type: String,
      required: [true, `Email is mandatory`],
      unique: [true, `Email is already in use`],
      validate: [validator.isEmail, `Invalid email format`],
    },
    password: {
      type: String,
      required: [true, `Password is mandatory`],
      minLength: [8, `Password must contain 8 or more characters`],
      select: false,
    },
    confirmPassword: {
      type: String,
      minLength: [8, `Password must contain 8 or more characters`],
      select: false,
    },
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: `user`,
      select: false,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.virtual(`reviews`, {
  ref: "Review",
  localField: "_id",
  foreignField: "user",
});

const User = mongoose.model(`User`, userSchema);

module.exports = User;
