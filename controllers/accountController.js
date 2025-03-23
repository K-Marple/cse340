const utilities = require("../utilities");
const accModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

/* ********************
 * Deliver login view
 ***********************/
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  });
}

/* ********************
 * Deliver registration view
 ***********************/
async function buildRegistration(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/registration", {
    title: "Register",
    nav,
    errors: null,
  });
}

/* ********************
 * Process registration
 ***********************/
async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;

  // Hash password
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processing the registration."
    );
    res.status(500).render("account/registration", {
      title: "Register",
      nav,
      errors: null,
    });
  }

  const regResult = await accModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  );

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    );
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("account/registration", {
      title: "Registration",
      nav,
      errors,
    });
  }
}

/* ********************
 * Process login request
 ***********************/
async function accountLogin(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const accountData = await accModel.getAccountByEmail(account_email);
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.");
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
    return;
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password;
      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 * 1000 }
      );
      if (process.env.NODE_ENV === "development") {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
      } else {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 3600 * 1000,
        });
      }
      return res.redirect("/account/");
    } else {
      req.flash(
        "message notice",
        "Please check your credentials and try again."
      );
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      });
    }
  } catch (error) {
    throw new Error("Access Forbidden");
  }
}

/* ********************
 * Deliver management view
 ***********************/
async function buildManagement(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/management", {
    title: "Account Management",
    nav,
    errors: null,
  });
}

/* ********************
 * Deliver update view
 ***********************/
async function buildUpdateAccount(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/update", {
    title: "Update Account",
    nav,
    errors: null,
  });
}

/* ********************
 * Process update account
 ***********************/
async function updateAccount(req, res) {
  let nav = await utilities.getNav();
  const { account_firstname, account_lastname, account_email, account_id } =
    req.body;
  const accountData = await accModel.getAccountById(account_id);
  const updateResult = await accModel.updateAccount(
    account_firstname,
    account_lastname,
    account_email
  );

  if (updateResult) {
    req.flash("notice", `You\'re account has been updated.`);
    res.status(201).render("account/management", {
      title: "Account Management",
      nav,
      errors: null,
      accountData,
    });
  } else {
    req.flash("notice", "Sorry, the update process failed.");
    res.status(501).render("account/update", {
      title: "Update Account",
      nav,
      errors,
    });
  }
}

/* ********************
 * Process password change
 ***********************/
async function changePassword(req, res) {
  let nav = await utilities.getNav();
  const { account_password } = req.body;

  // Hash password
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processing the password change."
    );
    res.status(500).render("account/update", {
      title: "Update Account",
      nav,
      errors: null,
    });
  }

  const passwordResult = await accModel.changePassword(hashedPassword);

  if (passwordResult) {
    req.flash("notice", `You have changed your password.`);
    res.status(201).render("account/management", {
      title: "Account Management",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, unable to change password.");
    res.status(501).render("account/update", {
      title: "Update Account",
      nav,
      errors,
    });
  }
}

module.exports = {
  buildLogin,
  buildRegistration,
  registerAccount,
  accountLogin,
  buildManagement,
  buildUpdateAccount,
  updateAccount,
  changePassword,
};
