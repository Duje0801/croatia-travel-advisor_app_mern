const express = require("express");

const router = express.Router();

const userController = require(`../controllers/userController`);

router.route("/find/:id").get(userController.protect, userController.oneUser);

router
  .route("/allUsers")
  .get(
    userController.protect,
    userController.restrictTo(`admin`),
    userController.allUsers
  );

router.route("/signUp").post(userController.signUp);
router.route("/logIn").post(userController.logIn);

router.route("/getMe").get(userController.protect, userController.getMe);

router
  .route("/deleteMe")
  .patch(
    userController.protect,
    userController.restrictTo(`user`),
    userController.deleteMe
  );

router
  .route("/deleteUser")
  .delete(
    userController.protect,
    userController.restrictTo(`admin`),
    userController.deleteUser
  );

router
  .route("/activate/:id")
  .patch(
    userController.protect,
    userController.restrictTo(`admin`),
    userController.activateUser
  );

router.route("/forgotPassword").post(userController.forgotPassword);

router.route(`/resetPassword`).patch(userController.resetPassword);

router
  .route(`/updatePassword`)
  .patch(userController.protect, userController.updatePassword);

router
  .route(`/updateEmail`)
  .patch(userController.protect, userController.updateEmail);

module.exports = router;
