const invModel = require("../models/inventory-model");
const accModel = require("../models/account-model");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();
  let list = "<ul>";
  list += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += "<li>";
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>";
    list += "</li>";
  });
  list += "</ul>";
  return list;
};

/* ************************
 * Build the classification view HTML
 * ************************ */
Util.buildClassificationGrid = async function (data) {
  let grid;
  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      grid += "<li>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        'details"><img src="' +
        vehicle.inv_thumbnail +
        '" alt="Image of ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' on CSE Motors" /></a>';
      grid += '<div class="namePrice">';
      grid += "<hr />";
      grid += "<h2>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details">' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        "</a>";
      grid += "</h2>";
      grid +=
        "<span>$" +
        new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
        "</span>";
      grid += "</div>";
      grid += "</li>";
    });
    grid += "</ul>";
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

/* ************************
 * Build the inventory detail view HTML
 * ************************ */
Util.buildInventoryGrid = async function (data) {
  let grid;
  vehicle = data[0];
  grid = '<div id="inv-detail">';
  grid +=
    '<img src="' +
    vehicle.inv_image +
    '" alt="Image of ' +
    vehicle.inv_make +
    " " +
    vehicle.inv_model +
    ' on CSE Motors" />';
  grid += '<div class="titlePrice">';
  grid +=
    "<h2>" +
    vehicle.inv_year +
    " " +
    vehicle.inv_make +
    " " +
    vehicle.inv_model;
  grid += "</h2>";
  grid +=
    "<h2>" +
    "<span>$" +
    Intl.NumberFormat("en-US").format(vehicle.inv_price) +
    "</span>";
  grid += "</h2>" + "</div>";
  grid += '<div class="details">';
  grid +=
    "<p>Mileage: " +
    Intl.NumberFormat("en-US").format(vehicle.inv_miles) +
    "</p>" +
    "<p>Color: " +
    vehicle.inv_color +
    "</p>" +
    "<p>Description: " +
    vehicle.inv_description +
    "</p>";
  grid += "</div>";
  grid += "</div>";

  return grid;
};

/* ************************
 * Build classification list for add inventory form
 * ************************ */
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications();
  let classificationList =
    '<select name="classification_id" id="classificationList" required>';
  classificationList += "<option value=''>Choose a Classification</option>";
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"';
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected ";
    }
    classificationList += ">" + row.classification_name + "</option>";
  });
  classificationList += "</select>";
  return classificationList;
};

/* ************************
 * Middleware for Handling Errors
 * Wrap other function in this for
 * General Error Handling
 * ************************ */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/* ************************
 * Middleware to check token validity
 * ************************ */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("Please log in");
          res.clearCookie("jwt");
          return res.redirect("/account/login");
        }
        res.locals.accountData = accountData;
        res.locals.loggedin = 1;
        next();
      }
    );
  } else {
    next();
  }
};

/* ************************
 * Check login
 * ************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next();
  } else {
    req.flash("notice", "Please log in.");
    return res.redirect("/account/login");
  }
};

/* ************************
 * Middleware to check token validity and account type
 * ************************ */
Util.checkAccount = async function (req, res, next) {
  const account_id = parseInt(res.locals.accountData.account_id);
  const data = await accModel.getAccountById(account_id);
  if (data.account_type == "Employee" || data.account_type == "Admin") {
    if (req.cookies.jwt) {
      jwt.verify(
        req.cookies.jwt,
        process.env.ACCESS_TOKEN_SECRET,
        function (err, accountData) {
          if (err) {
            req.flash("Please log in");
            res.clearCookie("jwt");
            return res.redirect("/account/login");
          }
          res.locals.accountData = accountData;
          res.locals.loggedin = 1;
          next();
        }
      );
    } else {
      next();
    }
  } else {
    req.flash("Unauthorized Access.");
    res.redirect("/");
  }
};

/* ************************
 * Build the review views on inventory detail
 ************************** */
Util.buildReviewList = async function (data) {
  // const accountInfo = await accModel.getAccountById(account);
  // console.log(accountInfo);
  // const screenName =
  //   req.params.account_firstname.substring(0, 1).toLowerCase() +
  //   res.account_lastname.toLowerCase();
  let options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  let list;
  list = "<div class='reviewList'>";
  data.forEach((row) => {
    list += "<ul>";
    // list += screenName;
    list += row.review_text;
    list += Intl.DateTimeFormat("en-US", options).format(row.review_date);
    list += "</ul>";
  });
  list += "</div>";
  return list;
};

/* ************************
 * Build the review views on account management
 ************************** */
Util.buildReviewAcc = async function (data) {
  let options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  let list;
  list = "<div class='reviewAcc'>";
  data.forEach((row) => {
    list += "<ul>";
    list +=
      row.review_text +
      "<br>" +
      Intl.DateTimeFormat("en-US", options).format(row.review_date);
    list += "</ul>";
    list += "<a href='../review/edit/" + row.review_id + "'>Edit</a>";
    list += " ";
    list += "<a href='../reveiw/delete/" + row.review_id + "'>Delete</a>";
  });
  list += "</div>";
  return list;
};

module.exports = Util;
