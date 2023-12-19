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
  .route("/activateUser")
  .patch(
    authController.protect,
    authController.restrictTo(`admin`),
    userController.activateUser
  );

router
  .route("/deactivateUser")
  .patch(
    authController.protect,
    authController.restrictTo(`admin`),
    userController.deactivateUser
  );

router.route("/forgotPassword").post(authController.forgotPassword);

router.route(`/resetPassword`).patch(authController.resetPassword);

router
  .route(`/updatePassword`)
  .patch(
    authController.protect,
    authController.restrictTo(`user`),
    userController.updatePassword
  );

router
  .route(`/updateEmail`)
  .patch(
    authController.protect,
    authController.restrictTo(`user`),
    userController.updateEmail
  );

module.exports = router;
