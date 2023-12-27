import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { User } from "../model/userModel";
import { IUser } from "../interfaces/user";
import { ReqUser } from "../interfaces/reqUser";
import { errorResponse } from "../utilis/errorResponse";
import { errorHandler } from "../utilis/errorHandler";

interface QueryInRequest extends Request {
  query: { page: string };
}

const userList: any = async function (req: QueryInRequest, res: Response) {
  try {
    const page: number = Number(req.query.page);
    const skip: number = ((page || 1) - 1) * 10;

    const totalUsersNumber: number | null = await User.find().countDocuments();

    if (totalUsersNumber === null)
      return errorResponse(
        "Something went wrong, please try again later.",
        res,
        404
      );

    const users: IUser[] | null = await User.find().skip(skip).limit(10);

    if (!users || !users[0])
      return errorResponse("Can't find any users", res, 404);

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
    const user: IUser | null = await User.findOne({
      username: params,
    }).populate({
      path: `reviews`,
    });

    if (!user) {
      return errorResponse("Can't find user with this username", res, 404);
    }

    res.status(200).json({
      status: `success`,
      data: user,
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
};

const deleteMe: any = async function (req: ReqUser, res: Response) {
  try {
    const myProfile: IUser | null = await User.findById(req.user._id);

    if (!myProfile) errorResponse("Can't find user", res, 404);
    else {
      //else is needed to save changes if myProfile === null
      myProfile.active = false;
      await myProfile.save();

      res.status(200).json({
        status: `success`,
        message: "Profile deactivated!",
      });
    }
  } catch (error) {
    errorHandler(error, req, res);
  }
};

const deleteUser: any = async function (req: Request, res: Response) {
  try {
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

const activationUser: any = async function (req: Request, res: Response) {
  try {
    const user: IUser | null = await User.findById(req.body.data).populate({
      path: `reviews`,
    });

    if (!user)
      return errorResponse(
        "Can't find and deactivate user with this ID",
        res,
        404
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

const updatePassword: any = async function (req: ReqUser, res: Response) {
  try {
    const oldPassword: string = req.body.data.oldPassword;
    const newPassword: string = req.body.data.newPassword;
    const confirmNewPassword: string = req.body.data.confirmNewPassword;

    const user: IUser | {} = await User.findById(req.user._id).select(
      `+password`
    );

    if (user && "password" in user && user.active) {
      if (newPassword !== confirmNewPassword)
        return errorResponse("Passwords must be identical", res, 401);

      if (!(await bcrypt.compare(oldPassword, user.password)))
        return errorResponse("Incorrect old password", res, 401);

      user.password = await bcrypt.hash(newPassword, 12);

      await user.save({ validateBeforeSave: true });

      res.status(200).json({
        status: "success",
        message: "Password successfully updated!",
      });
    } else return errorResponse("Can't find user with this ID", res, 404);
  } catch (error) {
    errorHandler(error, req, res);
  }
};

const updateEmail: any = async function (req: ReqUser, res: Response) {
  try {
    const oldEmail: string = req.body.data.oldEmail;
    const newEmail: string = req.body.data.newEmail;
    const password: string = req.body.data.password;

    const user: IUser | {} = await User.findById(req.user._id).select(
      `+password`
    );

    if (user && "password" in user && "email" in user && user.active) {
      if (oldEmail === newEmail)
        return errorResponse("New mail is same as old email", res, 401);

      if (oldEmail !== user.email)
        return errorResponse("Incorrect old mail", res, 401);

      if (!(await bcrypt.compare(password, user.password)))
        return errorResponse("Incorrect password", res, 401);

      if (await User.findOne({ email: newEmail }))
        return errorResponse("Email is already in use", res, 401);

      user.email = newEmail;

      await user.save({ validateBeforeSave: true });

      res.status(200).json({
        status: "success",
        data: {
          username: user.username,
          email: user.email,
        },
      });
    } else return errorResponse("Can't find user with this ID", res, 404);
  } catch (error) {
    errorHandler(error, req, res);
  }
};

export {
  oneUser,
  userList,
  deleteMe,
  deleteUser,
  activationUser,
  updatePassword,
  updateEmail,
};
