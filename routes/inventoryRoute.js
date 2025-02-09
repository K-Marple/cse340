// Needed Resources
const express = require('express')
const router = new express.Router()
const invController = require('../controllers/invController')

// Route to build inventory by classification view
router.get('/type/:classificationId', invController.buildByClassificationId);

// Route to build specific inventory detail view
router.get('/detail/:invId', invController.buildByInventoryId);

// Route to 500 error
router.get('/detail/500', invController.buildFootError);

module.exports = router;