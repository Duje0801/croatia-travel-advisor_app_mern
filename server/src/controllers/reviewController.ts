import { Response } from "express";
import { Destination } from "../model/destinationModel";
import { Review } from "../model/reviewModel";
import { IReview } from "../interfaces/review";
import { IDestination } from "../interfaces/destination";
import { ReqUser } from "../interfaces/reqUser";
import { errorResponse } from "../utilis/errorResponse";
import { errorHandler } from "../utilis/errorHandler";

const createReview: any = async function (req: ReqUser, res: Response) {
  try {
    const title: string = req.body.data.title;
    const text: string = req.body.data.text;
    const rating: string = req.body.data.rating;
    const DestinationId: string = req.body.data.destination.id;
    const destinationName: string = req.body.data.destination.name;
    const userId: string = req.user._id;
    const userUsername: string = req.user.username;

    const newReview: IReview = await Review.create({
      title,
      text: text,
      rating,
      destination: {
        id: DestinationId,
        name: destinationName,
      },
      user: {
        id: userId,
        username: userUsername,
      },
    });

    if (!newReview) return errorResponse(`Can't create new review`, res, 404);

    const destinationId: string = newReview.destination.id;

    await Review.calcAverageRatings(destinationId);

    const updatedDestination: IDestination | null = await Destination.findById(
      destinationId
    ).populate({
      path: `reviews`,
      match: { "destination.id": { $eq: destinationId } },
      options: { sort: { createdAt: -1 }, limit: 5 },
    });

    if (!updatedDestination)
      return errorResponse(
        `Review is created but can't update destination info now. Please try again later.`,
        res,
        400
      );

    res.status(201).json({
      status: `success`,
      message: `Review succesfully added!`,
      data: updatedDestination,
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
};

const updateReview: any = async function (req: ReqUser, res: Response) {
  try {
    const params: string = req.params.id;
    let updatedFields: {} = {};
    if (req.body.data.title) updatedFields = { title: req.body.data.title };
    if (req.body.data.text)
      updatedFields = { ...updatedFields, text: req.body.data.text };
    if (req.body.data.rating)
      updatedFields = { ...updatedFields, rating: req.body.data.rating };

    const getReview: IReview | null = await Review.findById(params);

    if (!getReview) {
      return errorResponse(`Can't find review with this ID`, res, 404);
    }

    if (
      getReview.user.id !== String(req.user._id) &&
      req.user.role !== "admin"
    ) {
      return errorResponse(
        `You don't have permission to update this review`,
        res,
        401
      );
    }

    const updatedReview: IReview | null = await Review.findByIdAndUpdate(
      req.params.id,
      {
        ...updatedFields,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedReview)
      return errorResponse(
        `Review is updated but can't update destination info now. Please try again later.`,
        res,
        400
      );

    const destinationId: string = updatedReview.destination.id;

    await Review.calcAverageRatings(destinationId);

    const page: number = Number(req.body.data.page);
    const skip: number = ((page || 1) - 1) * 5;

    const updatedDestination: IDestination | null = await Destination.findById(
      destinationId
    ).populate({
      path: `reviews`,
      match: { "destination.id": { $eq: destinationId } },
      options: { sort: { createdAt: -1 }, skip: skip, limit: 5 },
    });

    res.status(200).json({
      status: `success`,
      message: `Review succesfully edited!`,
      data: updatedDestination,
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
};

const deleteReview: any = async function (req: ReqUser, res: Response) {
  try {
    const params: string = req.params.id;

    const getReview: IReview | null = await Review.findById(params);

    if (!getReview)
      return errorResponse(`Can't find review with this ID`, res, 404);

    if (getReview.user.id !== String(req.user._id) && req.user.role !== "admin")
      return errorResponse(
        `You don't have permission to delete this review`,
        res,
        401
      );

    await Review.findByIdAndDelete(params);

    const destinationId: string = getReview.destination.id;

    await Review.calcAverageRatings(destinationId);

    const updatedDestination: IDestination | null = await Destination.findById(
      destinationId
    ).populate({
      path: `reviews`,
      match: { "destination.id": { $eq: destinationId } },
      options: { sort: { createdAt: -1 }, limit: 5 },
    });

    if (!updatedDestination)
      return errorResponse(
        `Review is deleted but can't update destination info now. Please try again later.`,
        res,
        400
      );

    res.status(200).json({
      status: `success`,
      message: `Review succesfully deleted!`,
      data: updatedDestination,
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
};

const destinationReviews: any = async function (req: ReqUser, res: Response) {
  try {
    const params: string = req.params.id;
    const page: number = Number(req.query.page);
    const skip: number = ((page || 1) - 1) * 5;
    const rating: number = Number(req.query.rating);

    let findRating: any = {
      "destination.name": params,
    };

    if (rating > 0) {
      //If user wants to see only reviews with selected rating
      findRating = {
        "destination.name": params,
        rating: rating,
      };
    }

    const reviews = await Review.find(findRating)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(5);

    if (!reviews) return errorResponse(`Can't find any reviews.`, res, 400);

    const totalUsersNumber: number | null = await Review.find(
      findRating
    ).countDocuments();

    if (totalUsersNumber === null)
      return errorResponse(
        "Something went wrong, please try again later.",
        res,
        404
      );

    res.status(200).json({
      status: `success`,
      quantity: totalUsersNumber || 0,
      data: reviews,
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
};

export { createReview, updateReview, deleteReview, destinationReviews };
