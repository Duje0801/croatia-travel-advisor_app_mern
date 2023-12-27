import { Schema, model } from "mongoose";
import { Review } from "./reviewModel";
import validator from "validator";
import { IUser } from "../interfaces/user";

const userSchema = new Schema(
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
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: `user`,
    },
    restartPasswordCode: { type: String, select: false },
    restartPasswordCodeExpire: { type: Date, select: false },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.virtual(`reviews`, {
  ref: Review,
  localField: "_id",
  foreignField: "user.id",
});

const User = model<IUser>(`User`, userSchema);

export { User };
