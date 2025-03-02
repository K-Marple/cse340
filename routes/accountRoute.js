// Needed Resources
const express = require('express')
const router = new express.Router()
const utilities = require('../utilities')
const accController = require('../controllers/accountController')
const regValidate = require('../utilities/account-validation')

router.get('/login', utilities.handleErrors(accController.buildLogin))

router.get('/register', utilities.handleErrors(accController.buildRegistration))

// Process registration data
router.post(
    '/register', 
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accController.registerAccount)
)

// Process the login attempt
router.post(
    "/login",
    (req, res) => {
      res.status(200).send('login process')
    }
  )

module.exports = router;