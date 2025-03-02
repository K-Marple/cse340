const utilities = require("../utilities")
const accModel = require("../models/account-model")
const bcrypt = require("bcryptjs")

/* ********************
 * Deliver login view
***********************/
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
        title: "Login",
        nav,
    })
}

/* ********************
 * Deliver registration view
***********************/
async function buildRegistration(req, res, next) {
    let nav = await utilities.getNav()
    res.render('account/registration', {
        title: "Register",
        nav,
        errors: null,
    })
}

/* ********************
 * Process registration
***********************/
async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body

    // Hash password
    let hashedPassword
    try {
        // regular password and cost (salt is generated automatically)
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
        req.flash("notice", 'Sorry, there was an error processing the registration.')
        res.status(500).render("account/registration", {
            title: "Register",
            nav,
            errors: null,
        })
    }

    const regResult = await accModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        hashedPassword
    )

    if (regResult) {
        req.flash(
            "notice",
            `Congratulations, you\'re registered ${account_firstname}. Please log in.`
        )
        res.status(201).render("account/login", {
            title: "Login",
            nav,
            errors: null,
        })
    } else {
        req.flash("notice", "Sorry, the registration failed.")
        res.status(501).render("account/registration", {
            title: "Registration",
            nav,
            errors,
        })
    }
}

module.exports = { buildLogin, buildRegistration, registerAccount }