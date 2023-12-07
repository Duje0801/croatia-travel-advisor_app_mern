const express = require("express");
const reviewController = require("../controllers/reviewController");

const router = express.Router();

router.route("/").post(reviewController.createReview);

router
  .route("/:id")
  .patch(reviewController.updateReview)
  .delete(reviewController.deleteReview);

module.exports = router;
