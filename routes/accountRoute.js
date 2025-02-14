// Needed Resources
const express = require('express')
const router = new express.Router()
const utilities = require('../utilities')
const accController = require('../controllers/accountController')

router.get('/login', utilities.handleErrors(accController.buildLogin))

module.exports = router;