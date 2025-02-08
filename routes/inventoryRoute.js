// Needed Resources
const express = require('express')
const router = new express.Router()
const detail = new express.Router()
const invController = require('../controllers/invController')

// Route to build inventory by classification view
router.get('/type/:classificationId', invController.buildByClassificationId);

// Route to build specific inventory detail view
detail.get('/type/:inv_id', invController.buildByInventoryId);

module.exports = router, detail;