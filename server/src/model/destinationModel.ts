import { Schema, model } from "mongoose";
import { IDestination } from "../interfaces/destination";
import { Review } from "./reviewModel";

const destinationSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, `Destination name is mandatory`],
      unique: [true, `Destination must have a unique name`],
      minLength: [3, `Destination name must contain 3 or more characters`],
      maxLength: [
        30,
        `The maximum number of characters allowed in the destination name is 30`,
      ],
    },
    description: {
      type: String,
      required: [true, `Destination description is mandatory`],
      minLength: [
        20,
        `Destination description must contain 20 or more characters`,
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
    category: {
      type: [String],
      validate: (v: string) => v.length > 0,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

destinationSchema.virtual("reviews", {
  ref: Review,
  localField: "_id",
  foreignField: "destination.id",
});

const Destination = model<IDestination>("Destination", destinationSchema);

export { Destination };
