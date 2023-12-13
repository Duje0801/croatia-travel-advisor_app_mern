const express = require("express");

const destinationController = require("../controllers/destinationController");
const authController = require(`../controllers/authorizationController`);

const router = express.Router();

router
  .route("/")
  .post(
    authController.protect,
    authController.restrictTo(`admin`),
    destinationController.createDestination
  );

router.route("/search/:id").get(destinationController.searchDestination);

router.route("/category/:id").get(destinationController.getCategory);

router
  .route("/:id")
  .get(destinationController.getOneDestination)
  .patch(
    authController.protect,
    authController.restrictTo(`admin`),
    destinationController.updateDestination
  )
  .delete(
    authController.protect,
    authController.restrictTo(`admin`),
    destinationController.deleteDestination
  );

module.exports = router;
