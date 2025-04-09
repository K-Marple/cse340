// Requirements
const utilities = require(".");
const { body, validationResult } = require("express-validator");
const { registerAccount } = require("../models/account-model");
const validate = {};

validate.updateRules = () => {
  return [
    //review_text is required and must be string
    body("review_text")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please enter text into the review box."),
  ];
};

validate.checkUpdateData = async (req, res, next) => {
  const { review_id, review_text, review_date, inv_id, account_id } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("review/edit", {
      errors,
      title: "Edit Review",
      nav,
      review_id,
      review_text,
      review_date,
      inv_id,
      account_id,
    });
    return;
  }
  next();
};

module.exports = validate;
