// Needed Resources
const express = require("express");
const router = new express.Router();
const utilities = require("../utilities");
const revController = require("../controllers/reviewController");
const revValidate = require("../utilities/review-validation");

// Build review edit
router.get("/edit", utilities.handleErrors(revController.buildEdit));

// Build review delete
router.get("/delete", utilities.handleErrors(revController.buildDelete));

// Process edit data
router.post(
  "/update",
  revValidate.updateRules(),
  revValidate.checkUpdateData,
  utilities.handleErrors(revController.updateReview)
);

// Process the login attempt
router.post("/deleted", utilities.handleErrors(revController.deleteReview));

module.exports = router;
