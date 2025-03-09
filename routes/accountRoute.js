// Needed Resources
const express = require("express");
const router = new express.Router();
const utilities = require("../utilities");
const accController = require("../controllers/accountController");
const regValidate = require("../utilities/account-validation");

// Default route
router.get(
  "/accManagement",
  utilities.handleErrors(accController.buildAccountManagement)
);

// Build login
router.get("/login", utilities.handleErrors(accController.buildLogin));

// Build Registration
router.get(
  "/registration",
  utilities.handleErrors(accController.buildRegistration)
);

// Process registration data
router.post(
  "/registration",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accController.registerAccount)
);

// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accController.accountLogin)
);

module.exports = router;
