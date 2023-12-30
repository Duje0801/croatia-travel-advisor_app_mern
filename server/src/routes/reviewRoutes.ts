import express, { Router } from "express";

import {
  createReview,
  updateReview,
  deleteReview,
  destinationReviews,
  alreadyReviewed,
} from "../controllers/reviewController";

import { protect } from "../controllers/authorizationController";

export const router: Router = express.Router();

router.route("/").post(protect, createReview);

router.route("/destinationReviews/:id").get(destinationReviews);

router.route("/alreadyReviewed/:id").get(protect, alreadyReviewed);

router.route("/:id").patch(protect, updateReview).delete(protect, deleteReview);
