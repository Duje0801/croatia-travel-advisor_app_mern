const express = require("express");
const destinationController = require("../controllers/destinationController");
const userController = require("../controllers/userController");

const router = express.Router();

router
  .route("/")
  .get(destinationController.getDestination)
  .post(
    userController.protect,
    userController.restrictTo(`admin`),
    destinationController.createDestination
  );

router
  .route("/:id")
  .get(destinationController.getDestination)
  .patch(userController.protect, destinationController.updateDestination)
  .delete(userController.protect, destinationController.deleteDestination);

module.exports = router;
