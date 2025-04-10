// Needed Resources
const express = require("express");
const router = new express.Router();
const utilities = require("../utilities");
const revController = require("../controllers/reviewController");
const revValidate = require("../utilities/review-validation");

// Build review edit
router.get("/edit/:review_id", utilities.handleErrors(revController.buildEdit));

// Build review delete
router.get(
  "/delete/:review_id",
  utilities.handleErrors(revController.buildDelete)
);

// Process add review
router.post("/inv/review", utilities.handleErrors(revController.addReview));

// Process edit data
router.post(
  "/updated",
  revValidate.updateRules(),
  revValidate.checkUpdateData,
  utilities.handleErrors(revController.updateReview)
);

// Process the login attempt
router.post("/deleted", utilities.handleErrors(revController.deleteReview));

module.exports = router;
