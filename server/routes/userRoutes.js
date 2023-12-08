const express = require("express");

const router = express.Router();

const userController = require(`../controllers/userController`);

router.route("/signUp").post(userController.signUp);
router.route("/logIn").post(userController.logIn);
router.route("/getMe").get(userController.protect, userController.getMe);
router.route("/deleteMe").post(userController.protect, userController.deleteMe);
router
  .route("/deleteUser")
  .delete(
    userController.protect,
    userController.restrictTo(`admin`),
    userController.deleteUser
  );

module.exports = router;
