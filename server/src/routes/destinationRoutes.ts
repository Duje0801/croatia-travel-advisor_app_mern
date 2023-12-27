import express, { Router } from "express";

import {
  getOneDestination,
  getCategory,
  createDestination,
  updateDestination,
  deleteDestination,
  searchDestination,
} from "../controllers/destinationController";

import { protect, restrictTo } from "../controllers/authorizationController";

export const router: Router = express.Router();

router.route("/").post(protect, restrictTo(`admin`), createDestination);

router.route("/search/:id").get(searchDestination);

router.route("/category/:id").get(getCategory);

router
  .route("/:id/:reviewId?")
  .get(getOneDestination)
  .patch(protect, restrictTo(`admin`), updateDestination)
  .delete(protect, restrictTo(`admin`), deleteDestination);
