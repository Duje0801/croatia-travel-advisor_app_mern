import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { User } from "../model/userModel";
import { Review } from "../model/reviewModel";
import { IUser } from "../interfaces/user";
import { ReqUser } from "../interfaces/reqUser";
import { errorResponse } from "../utilis/errorResponse";
import { errorHandler } from "../utilis/errorHandler";

const userList: any = async function (req: Request, res: Response) {
  try {
    const page: number = Number(req.query.page);
    const skip: number = ((page || 1) - 1) * 10;

    const params: string = req.params.id;

    let usersFind: any = {};

    if (params) {
      usersFind = {
        username: { $regex: new RegExp(params, "i") },
      };
    }

    const users: IUser[] = await User.find(usersFind).skip(skip).limit(10);

    if (!users[0]) return errorResponse("Can't find any users", res, 404);

    //Gets the total number of users (for pagination)
    const totalUsersNumber: number | null = await User.find(
      usersFind
    ).countDocuments();

    if (totalUsersNumber === null)
      return errorResponse(
        "Something went wrong, please try again later.",
        res,
        404
      );

    res.status(200).json({
      status: `success`,
      quantity: totalUsersNumber,
      data: users,
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
};

const oneUser: any = async function (req: Request, res: Response) {
  try {
    const params: string = req.params.id;
    const page: number = Number(req.query.page);
    const skip: number = ((page || 1) - 1) * 5;

    const user: IUser | null = await User.findOne({
      username: params,
    }).populate({
      path: `reviews`,
      options: { sort: { createdAt: -1 }, skip: skip, limit: 5 },
    });

    if (!user)
      return errorResponse("Can't find user with this username", res, 404);

    const count: number = await Review.find({
      "user.username": params,
    }).countDocuments();

    res.status(200).json({
      status: `success`,
      reviewsQuantity: count,
      data: user,
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
};

const activationUser: any = async function (req: ReqUser, res: Response) {
  try {
    //This function (de)activates the user if the admin selects this option
    const user: IUser | null = await User.findById(req.body.data).populate({
      path: `reviews`,
      options: { sort: { createdAt: -1 } },
    });

    if (!user)
      return errorResponse(
        "Can't find and deactivate user with this ID",
        res,
        404
      );

    //Checks if user is allowed to delete review
    if (String(req.user._id) !== String(user._id) && req.user.role !== `admin`)
      return errorResponse(
        "You don't have permission for this operation",
        res,
        401
      );

    if (user.active === true) user.active = false;
    else if (user.active === false) user.active = true;

    await user.save();

    res.status(200).json({
      status: `success`,
      data: user,
      message: "User is deactivated!",
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
};

const deleteUser: any = async function (req: Request, res: Response) {
  try {
    //This function deletes the user if the admin selects this option
    const profileToDelete: IUser | {} = await User.findByIdAndDelete(
      req.body.id
    );

    if (!profileToDelete)
      return errorResponse("Can't find and delete user with this ID", res, 404);

    res.status(200).json({
      status: `success`,
      message: "Profile permanently deleted!",
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
};

const updatePassword: any = async function (req: ReqUser, res: Response) {
  try {
    const oldPassword: string = req.body.data.oldPassword;
    const newPassword: string = req.body.data.newPassword;
    const confirmNewPassword: string = req.body.data.confirmNewPassword;

    if (newPassword !== confirmNewPassword)
      return errorResponse("Passwords must be identical", res, 401);

    if (
      oldPassword.length < 8 ||
      newPassword.length < 8 ||
      confirmNewPassword.length < 8
    ) {
      return errorResponse(
        "Password must contain 8 or more characters",
        res,
        400
      );
    }

    const user: IUser | {} = await User.findById(req.user._id).select(
      `+password`
    );

    if (user && "password" in user && user.active) {
      if (!(await bcrypt.compare(oldPassword, user.password)))
        return errorResponse("Incorrect old password", res, 401);

      user.password = await bcrypt.hash(newPassword, 12);

      await user.save();

      res.status(200).json({
        status: "success",
        message: "Password successfully updated!",
      });
    } else return errorResponse("Can't find this user", res, 404);
  } catch (error) {
    errorHandler(error, req, res);
  }
};

const updateEmail: any = async function (req: ReqUser, res: Response) {
  try {
    const oldEmail: string = req.body.data.oldEmail;
    const newEmail: string = req.body.data.newEmail;
    const password: string = req.body.data.password;

    if (oldEmail === newEmail)
      return errorResponse("New mail is same as old email", res, 401);

    if (password.length < 8) {
      return errorResponse(
        "Password must contain 8 or more characters",
        res,
        401
      );
    }

    const user: IUser | {} = await User.findById(req.user._id).select(
      `+password`
    );

    if (user && "password" in user && "email" in user && user.active) {
      if (oldEmail !== user.email)
        return errorResponse("Incorrect old mail", res, 401);

      if (!(await bcrypt.compare(password, user.password)))
        return errorResponse("Incorrect password", res, 401);

      if (await User.findOne({ email: newEmail }))
        return errorResponse("New email is already in use", res, 401);

      user.email = newEmail;

      await user.save({ validateBeforeSave: true });

      res.status(200).json({
        status: "success",
        data: {
          username: user.username,
          email: user.email,
        },
      });
    } else return errorResponse("Can't find this user", res, 404);
  } catch (error) {
    errorHandler(error, req, res);
  }
};

export {
  oneUser,
  userList,
  deleteUser,
  activationUser,
  updatePassword,
  updateEmail,
};
