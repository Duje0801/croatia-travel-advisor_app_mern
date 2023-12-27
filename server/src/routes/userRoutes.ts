import express, { Router } from "express";

import {
  oneUser,
  userList,
  deleteMe,
  deleteUser,
  activationUser,
  updatePassword,
  updateEmail,
} from "../controllers/userController";

import {
  signUp,
  logIn,
  forgotPassword,
  resetPassword,
  protect,
  restrictTo,
} from "../controllers/authorizationController";

export const router: Router = express.Router();

router.route("/find/:id").get(protect, oneUser);

router.route("/userList").get(protect, restrictTo(`admin`), userList);

router.route("/signUp").post(signUp);

router.route("/logIn").post(logIn);

router.route("/deleteMe").patch(protect, restrictTo(`user`), deleteMe);

router.route("/deleteUser").delete(protect, restrictTo(`admin`), deleteUser);

router
  .route("/activationUser")
  .patch(protect, restrictTo(`admin`), activationUser);

router.route("/forgotPassword").post(forgotPassword);

router.route(`/resetPassword`).patch(resetPassword);

router
  .route(`/updatePassword`)
  .patch(protect, restrictTo(`user`), updatePassword);

router.route(`/updateEmail`).patch(protect, restrictTo(`user`), updateEmail);
