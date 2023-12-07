const express = require("express");
const reviewController = require("../controllers/reviewController");
const userController = require("../controllers/userController");

const router = express.Router();

router.route("/").post(userController.protect, reviewController.createReview);

router
  .route("/:id")
  .patch(userController.protect, reviewController.updateReview)
  .delete(userController.protect, reviewController.deleteReview);

module.exports = router;
