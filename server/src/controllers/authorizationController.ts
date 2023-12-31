import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { User } from "../model/userModel";
import { IUser } from "../interfaces/user";
import { ReqUser } from "../interfaces/reqUser";
import { errorResponse } from "../utilis/errorResponse";
import { errorHandler } from "../utilis/errorHandler";
import { sendEmail } from "../utilis/sendEmail";

dotenv.config();

const createToken = (_id: string): string => {
  return jwt.sign({ _id }, process.env.JWT_PRIVATE_KEY!, {
    expiresIn: process.env.JWT_PRIVATE_KEY_EXPIRES!,
  });
};

const signUp: any = async function (req: Request, res: Response) {
  try {
    const username: string = req.body.data.username;
    const email: string = req.body.data.email;
    let password: string = req.body.data.password;
    const confirmPassword: string = req.body.data.confirmPassword;

    if (password !== confirmPassword)
      return errorResponse("Passwords must be identical", res, 401);

    if (password.length < 8 || confirmPassword.length < 8) {
      return errorResponse(
        "Password must contain 8 or more characters",
        res,
        401
      );
    }

    //Password hashing
    password = await bcrypt.hash(password, 12);

    const newUser: IUser | null = await User.create({
      username,
      email,
      password,
    });

    if (!newUser) return errorResponse("Can't create new user", res, 401);

    const token: string = createToken(newUser._id);

    res.status(201).json({
      status: `success`,
      data: {
        username,
        email,
        token,
      },
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
};

const logIn: any = async function (req: Request, res: Response) {
  try {
    const email = req.body.data.email;
    const password = req.body.data.password;

    const user: IUser | {} = await User.findOne({ email }).select("+password");

    if (!user)
      return errorResponse("User with this email don't exist", res, 401);

    if ("active" in user && !user.active)
      return errorResponse("User is deactivated", res, 401);

    if (
      !("password" in user) ||
      !(await bcrypt.compare(password, user.password))
    )
      return errorResponse("Incorrect password", res, 401);

    const token: string = createToken(user._id);

    res.status(200).json({
      status: `success`,
      data: { username: user.username, email: user.email, token },
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
};

const forgotPassword: any = async function (req: Request, res: Response) {
  try {
    const email: string = req.body.data.email;

    const user: IUser | null = await User.findOne({ email });

    if (!user)
      return errorResponse(
        "There is no user with this email address",
        res,
        401
      );

    if (!user.active)
      return errorResponse("User with this email is deactivated", res, 401);

    //Generates code (restart password token)
    const code: string = crypto.randomBytes(12).toString(`hex`);

    //Code hashing
    const codeHashed: string = await bcrypt.hash(code, 12);

    //Adds code and expiraton time to mongo document
    user.restartPasswordCode = codeHashed;
    user.restartPasswordCodeExpire = new Date(Date.now() + 10 * 60 * 1000);

    //Saves changes to user document
    await user.save({ validateBeforeSave: true });

    //Sends mail (with token inside)
    await sendEmail(code, req.body.data.email);

    res
      .status(200)
      .json({ status: "success", message: "Email was sent successfully!" });
  } catch (error) {
    errorHandler(error, req, res);
  }
};

const resetPassword: any = async function (req: Request, res: Response) {
  try {
    const email: string = req.body.data.email;
    const token: string = req.body.data.token;
    const newPassword: string = req.body.data.newPassword;
    const confirmNewPassword: string = req.body.data.confirmNewPassword;

    if (newPassword !== confirmNewPassword)
      return errorResponse("Passwords must be identical", res, 401);

    if (newPassword.length < 8 || confirmNewPassword.length < 8) {
      return errorResponse(
        "Password must contain 8 or more characters",
        res,
        401
      );
    }

    const user: IUser | {} = await User.findOne({ email })
      .select(`+restartPasswordCode`)
      .select(`+restartPasswordCodeExpire`);

    if (!user)
      return errorResponse("User with this email don't exist", res, 401);

    if (user && "active" in user && user.active) {
      if (!(await bcrypt.compare(token, user.restartPasswordCode!)))
        return errorResponse("Invalid token code", res, 400);

      if (Date.now() > user.restartPasswordCodeExpire!.getTime())
        return errorResponse("Token expired, please log in again", res, 401);

      //Deletes info about code (token) and expiration time from user document
      user.restartPasswordCode = undefined;
      user.restartPasswordCodeExpire = undefined;
      user.password = await bcrypt.hash(newPassword, 12);

      //Saves changes to user document
      await user.save();

      res.status(200).json({
        status: "success",
        message: "Password succesfully changed!",
      });
    } else return errorResponse("User is deactivated", res, 401);
  } catch (error) {
    errorHandler(error, req, res);
  }
};

const protect: any = async function (
  req: ReqUser,
  res: Response,
  next: NextFunction
) {
  try {
    //Gets authorization (Bearer + jwt token) from client
    const authorization: string | undefined = req.headers.authorization;

    if (!authorization || !authorization.startsWith(`Bearer`))
      return errorResponse("Token invalid", res, 401);

    const token: string = authorization.split(" ")[1];

    //Checks is token valid
    const decoded: string | jwt.JwtPayload = jwt.verify(
      token,
      process.env.JWT_PRIVATE_KEY!
    );

    if (typeof decoded === `string`)
      return errorResponse("Token invalid", res, 401);

    const user: IUser | {} = await User.findOne({ _id: decoded._id }).select(
      `+role`
    );

    if (user && "active" in user && user.active) {
      //Memorize user data in request, only if user has field {active: true}
      req.user = user;
      next();
    } else if (user && "active" in user && !user.active)
      return errorResponse("User is deactivated", res, 401);
    else return errorResponse("User don't exist", res, 401);
  } catch (error) {
    errorHandler(error, req, res);
  }
};

const restrictTo: any = (...roles: string[]) => {
  return function (req: ReqUser, res: Response, next: NextFunction) {
    if (!roles.includes(req.user.role))
      return errorResponse(
        "You don't have permission for this operation",
        res,
        401
      );
    else next();
  };
};

export { signUp, logIn, forgotPassword, resetPassword, protect, restrictTo };
