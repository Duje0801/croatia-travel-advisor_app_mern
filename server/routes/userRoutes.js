const express = require("express");

const router = express.Router();

const userController = require(`../controllers/userController`);

router.route("/signUp").post(userController.signUp);
router.route("/logIn").post(userController.logIn);
router.route("/deleteMe").post(userController.protect, userController.deleteMe);
 
module.exports = router;
