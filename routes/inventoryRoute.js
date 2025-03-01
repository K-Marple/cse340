// Needed Resources
const express = require('express')
const router = new express.Router()
const invController = require('../controllers/invController')
const utilities = require('../utilities')
const invValidate = require('../utilities/inv-validation')


// Route to build inventory by classification view
router.get('/type/:classificationId', invController.buildByClassificationId);

// Route to build specific inventory detail view
router.get('/detail/:invId', invController.buildByInventoryId);

// Route to management
router.get('/', invController.buildManagement);

// Route to add classification
router.get('/add-classification', invController.buildAddClassification);

// Route to add inventory
router.get('/add-inventory', invController.buildAddInventory);

// Process add classification attempt
router.post(
    '/add-classification',
    invValidate.classRules(),
    invValidate.checkClassData,
    utilities.handleErrors(invController.addClassification)
);

// Process add inventory attempt
router.post(
    '/add-inventory',
    invValidate.invRules(),
    invValidate.checkInvData,
    utilities.handleErrors(invController.addInventory)
);

// Route to 500 error
router.get('/detail/500', invController.buildFootError);

module.exports = router;