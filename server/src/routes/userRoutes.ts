import express, { Router } from "express";

import {
  oneUser,
  userList,
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

router.route("/userList/:id?").get(protect, restrictTo(`admin`), userList);

router.route("/signUp").post(signUp);

router.route("/logIn").post(logIn);

//Change of field active from other users is prohibited within the function activationUser
router.route("/activationUser").patch(protect, activationUser);

router.route("/deleteUser").delete(protect, restrictTo(`admin`), deleteUser);

router.route("/forgotPassword").post(forgotPassword);

router.route(`/resetPassword`).patch(resetPassword);

router
  .route(`/updatePassword`)
  .patch(protect, restrictTo(`user`), updatePassword);

router.route(`/updateEmail`).patch(protect, restrictTo(`user`), updateEmail);
