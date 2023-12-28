import { Request, Response } from "express";
import { Destination } from "../model/destinationModel";
import { IDestination } from "../interfaces/destination";
import { errorResponse } from "../utilis/errorResponse";
import { errorHandler } from "../utilis/errorHandler";

const getOneDestination: any = async function (req: Request, res: Response) {
  try {
    const params: string = req.params.id;
    const reviewId: string = req.params.reviewId;
    const page: number = Number(req.query.page);
    const skip: number = ((page || 1) - 1) * 5;

    //Two populate cases, one if user needs only for one comment (link from user profile page) 
    //and another case if user wants to see all comments
    const destination: IDestination | null = await Destination.findOne({
      name: params,
    }).populate(reviewId ? {
      path: `reviews`,
      match: { _id: { $eq: reviewId } }
    } : {
      path: `reviews`,
      options: { sort: { createdAt: -1 }, skip: skip, limit: 5 },
    });

    if (!destination)
      return errorResponse(`Can't find destination with this name`, res, 404);

    res.status(200).json({
      status: `success`,
      data: destination,
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
};

const getCategory: any = async function (req: Request, res: Response) {
  try {
    const params: string = req.params.id;
    const page = Number(req.query.page);
    let destinationFind: any;
    let count: number = 0;

    if (params === `topRated`) {
      destinationFind = Destination.find({
        ratingQuantity: { $gte: 3 },
      })
        .sort(`-averageRating -ratingQuantity`)
        .limit(3);
    } else if (params === `trending`) {
      destinationFind = Destination.find({
        ratingQuantity: { $gte: 3 },
      })
        .sort(`-ratingQuantity -averageRating`)
        .limit(3);
    } else if (
      params === `history` ||
      params === `towns` ||
      params === `nature` ||
      params === `entertainment`
    ) {
      count = await Destination.find({
        category: params,
      }).countDocuments();

      const skip: number = ((page || 1) - 1) * 5;

      destinationFind = Destination.find({
        category: params,
      })
        .sort(`-ratingQuantity -averageRating`)
        .skip(skip)
        .limit(5);
    } else return errorResponse(`Category don't exist`, res, 404);

    const destination: IDestination[] | null = await destinationFind;

    //Checks if destination exists
    if (!destination || destination.length < 1)
      return errorResponse(`Can't find any destination`, res, 404);

    res.status(200).json({
      status: `success`,
      quantity: count || destination.length,
      data: destination,
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
};

const createDestination: any = async function (req: Request, res: Response) {
  try {
    const name: string = req.body.data.name;
    const description: string = req.body.data.description;
    const image: string = req.body.data.image;
    const category: string[] = req.body.data.category;

    const newDestination: IDestination | null = await Destination.create({
      name,
      description,
      image,
      category,
    });

    if (!newDestination)
      return errorResponse(
        `Can't create new destination, please try again later`,
        res,
        404
      );

    res.status(201).json({ status: `success`, destination: newDestination });
  } catch (error) {
    errorHandler(error, req, res);
  }
};

const updateDestination: any = async function (req: Request, res: Response) {
  try {
    let updatedFields: {} = {};
    if (req.body.data.description)
      updatedFields = {
        ...updatedFields,
        description: req.body.data.description,
      };
    if (req.body.data.image)
      updatedFields = { ...updatedFields, image: req.body.data.image };
    if (req.body.data.category)
      updatedFields = { ...updatedFields, category: req.body.data.category };

    const updatedDestination: IDestination | null =
      await Destination.findByIdAndUpdate(
        req.params.id,
        { ...updatedFields },
        {
          new: true,
          runValidators: true,
        }
      ).populate({
        path: `reviews`,
        options: { sort: { createdAt: -1 } },
      });

    if (!updatedDestination)
      return errorResponse(`Can't update destination with this ID`, res, 404);

    res.status(200).json({
      status: `success`,
      data: updatedDestination,
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
};

const deleteDestination: any = async function (req: Request, res: Response) {
  try {
    const params: string = req.params.id;

    const deletedDestination: IDestination | {} =
      await Destination.findByIdAndDelete(params);

    if (!deletedDestination)
      return errorResponse(`Can't delete destination with this ID`, res, 404);

    res.status(200).json({
      status: `success`,
      message: `Destination succesfully deleted!`,
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
};

const searchDestination: any = async function (req: Request, res: Response) {
  try {
    const params: string = req.params.id;

    const destinations: IDestination[] | null = await Destination.find({
      name: { $regex: new RegExp(params, "i") },
    })
      .select(`name`)
      .sort(`-ratingQuantity`)
      .limit(3);

    if (!destinations)
      return errorResponse(
        `Something went wrong, please try again later`,
        res,
        404
      );
    else if (destinations.length < 1) return;

    res.status(200).json({
      status: `success`,
      destinations,
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
};

export {
  getOneDestination,
  getCategory,
  createDestination,
  updateDestination,
  deleteDestination,
  searchDestination,
};
