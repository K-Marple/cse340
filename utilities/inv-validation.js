// Requirements
const utilities = require(".");
const { body, validationResult } = require("express-validator");
const validate = {};

/* *****************
 * Classification data validation rules
 * ******************/
validate.classRules = () => {
  return [
    // classification_name is required and must be string
    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please enter classification name."),
  ];
};

/* *****************
 * Check classification data and return errors or continue
 * ******************/
validate.checkClassData = async (req, res, next) => {
  const classification_name = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("inventory/addClassification", {
      errors,
      title: "Add Classification",
      nav,
      classification_name,
    });
    return;
  }
  next();
};

/* *****************
 * Inventory data validation rules
 * ******************/
validate.invRules = () => {
  return [
    // classification_name is required and must be string
    body("classification_id")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please enter classification name."),

    // inv_make is required and must be string
    body("inv_make")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please enter the vehicle make."),

    // inv_model is required and must be string
    body("inv_model")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please enter the vehicle model."),

    // inv_year is required and must be 4 digit number
    body("inv_year")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 4, max: 4 })
      .isNumeric()
      .withMessage("Please enter 4 digit year."),

    body("inv_price")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .isCurrency()
      .withMessage("Please enter a price."),

    body("inv_miles")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .isNumeric()
      .withMessage("Please enter the mileage."),

    body("inv_color")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please enter color of the vehilcle"),

    body("inv_image")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please enter a valid path."),

    body("inv_thumbnail")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please enter a valid path."),

    body("inv_description")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a brief description of the vehicle."),
  ];
};

/* *****************
 * Check inventory data and return errors or continue
 * ******************/
validate.checkInvData = async (req, res, next) => {
  const {
    classification_name,
    inv_make,
    inv_model,
    inv_year,
    inv_price,
    inv_miles,
    inv_color,
    inv_image,
    inv_thumbnail,
    inv_description,
  } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("inventory/addInventory", {
      errors,
      title: "Add Inventory",
      nav,
      classification_name,
      inv_make,
      inv_model,
      inv_year,
      inv_price,
      inv_miles,
      inv_color,
      inv_image,
      inv_thumbnail,
      inv_description,
    });
    return;
  }
  next();
};

/* *****************
 * Check edit/update data and return errors or continue
 * ******************/
validate.checkUpdateData = async (req, res, next) => {
  const {
    inv_id,
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_price,
    inv_miles,
    inv_color,
    inv_image,
    inv_thumbnail,
    inv_description,
  } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    const itemName = `${inv_make} ${inv_model}`;
    const classificationSelect = await utilities.buildClassificationList(
      classification_id
    );
    res.render("inventory/editInventory", {
      errors,
      title: "Edit " + itemName,
      nav,
      classificationSelect,
      inv_id,
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_price,
      inv_miles,
      inv_color,
      inv_image,
      inv_thumbnail,
      inv_description,
    });
    return;
  }
  next();
};

module.exports = validate;
