const express = require("express");

const router = express.Router();

const userController = require(`../controllers/userController`);
const authController = require(`../controllers/authorizationController`);

router.route("/find/:id").get(authController.protect, userController.oneUser);

router
  .route("/allUsers")
  .get(
    authController.protect,
    authController.restrictTo(`admin`),
    userController.allUsers
  );

router.route("/signUp").post(authController.signUp);
router.route("/logIn").post(authController.logIn);

router.route("/getMe").get(authController.protect, userController.getMe);

router
  .route("/deleteMe")
  .patch(
    authController.protect,
    authController.restrictTo(`user`),
    userController.deleteMe
  );

router
  .route("/deleteUser")
  .delete(
    authController.protect,
    authController.restrictTo(`admin`),
    userController.deleteUser
  );

router
  .route("/activate/:id")
  .patch(
    authController.protect,
    authController.restrictTo(`admin`),
    userController.activateUser
  );

router.route("/forgotPassword").post(authController.forgotPassword);

router.route(`/resetPassword`).patch(authController.resetPassword);

router
  .route(`/updatePassword`)
  .patch(authController.protect, userController.updatePassword);

router
  .route(`/updateEmail`)
  .patch(authController.protect, userController.updateEmail);

module.exports = router;
