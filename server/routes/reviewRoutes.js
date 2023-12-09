const express = require("express");
const reviewController = require("../controllers/reviewController");
const authController = require(`../controllers/authorizationController`);

const router = express.Router();

router.route("/").post(authController.protect, reviewController.createReview);

router
  .route("/:id")
  .patch(authController.protect, reviewController.updateReview)
  .delete(authController.protect, reviewController.deleteReview);

module.exports = router;
