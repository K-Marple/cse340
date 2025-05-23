// Needed Resources
const express = require("express");
const router = new express.Router();
const utilities = require("../utilities");
const invController = require("../controllers/invController");
const invValidate = require("../utilities/inv-validation");

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build specific inventory detail view
router.get("/detail/:invId", invController.buildByInventoryId);

// Route to management
router.get("/", utilities.checkAccount, invController.buildManagement);

// Route to add classification
router.get(
  "/add-classification",
  utilities.checkAccount,
  invController.buildAddClassification
);

// Route to add inventory
router.get(
  "/add-inventory",
  utilities.checkAccount,
  invController.buildAddInventory
);

// Process add classification attempt
router.post(
  "/add-classification",
  invValidate.classRules(),
  invValidate.checkClassData,
  utilities.checkAccount,
  utilities.handleErrors(invController.addClassification)
);

// Process add inventory attempt
router.post(
  "/add-inventory",
  invValidate.invRules(),
  invValidate.checkInvData,
  utilities.checkAccount,
  utilities.handleErrors(invController.addInventory)
);

// Route to get inventory by classification
router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
);

// Route to edit inventory
router.get(
  "/edit/:inv_id",
  utilities.checkAccount,
  utilities.handleErrors(invController.buildEditInventory)
);

// Process edit inventory
router.post(
  "/update/",
  invValidate.invRules(),
  invValidate.checkUpdateData,
  utilities.checkAccount,
  utilities.handleErrors(invController.updateInventory)
);

// Route to delete inventory
router.get(
  "/delete/:inv_id",
  utilities.checkAccount,
  utilities.handleErrors(invController.buildDeleteInventory)
);

// Process delete inventory
router.post(
  "/deleted/",
  utilities.checkAccount,
  utilities.handleErrors(invController.deleteInventory)
);

// Route to 500 error
router.get("/detail/500", invController.buildFootError);

module.exports = router;
