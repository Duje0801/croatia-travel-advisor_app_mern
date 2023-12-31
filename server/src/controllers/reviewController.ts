import { Request, Response } from "express";
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

    //Updates the amount of destination ratings and average ratings,
    //then sends it to client (front-end)
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
    //Checks for changes in review data
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

    //Checks if user is allowed to edit review data
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

    //Updates the amount of destination ratings and average ratings,
    //then sends it to client (front-end)
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

    //Checks if user is allowed to delete review
    if (getReview.user.id !== String(req.user._id) && req.user.role !== "admin")
      return errorResponse(
        `You don't have permission to delete this review`,
        res,
        401
      );

    await Review.findByIdAndDelete(params);

    const destinationId: string = getReview.destination.id;

    //Updates the amount of destination ratings and average ratings,
    //then sends it to client (front-end)
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

const destinationReviews: any = async function (req: Request, res: Response) {
  try {
    //This function is used when user selects another reviews page (in destination)
    //Then user (for example) moves from page 1 to 2 (reviews 1-5 to 6-10)
    const params: string = req.params.id;
    const page: number = Number(req.query.page);
    const skip: number = ((page || 1) - 1) * 5;
    const rating: number = Number(req.query.rating);

    //If user selected reviews with only one possible ratings,
    //search inside find() will change
    let findRating: any =
      rating > 0
        ? {
            "destination.name": params,
            rating: rating,
          }
        : {
            "destination.name": params,
          };

    const reviews = await Review.find(findRating)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(5);

    if (!reviews) return errorResponse(`Can't find any reviews.`, res, 400);

    //Gets the total number of reviews (for pagination)
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

const alreadyReviewed: any = async function (req: ReqUser, res: Response) {
  try {
    //This function checks if the user has already viewed this destination
    //Returns only true or false
    const userId: string = req.user._id;
    const destinationId: string = req.params.id;

    const getReview: IReview | null = await Review.findOne({
      "destination.id": destinationId,
      "user.id": userId,
    });

    return res.status(200).json({
      status: `success`,
      data: { isReviewed: getReview === null ? false : true },
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
};

export {
  createReview,
  updateReview,
  deleteReview,
  destinationReviews,
  alreadyReviewed,
};
