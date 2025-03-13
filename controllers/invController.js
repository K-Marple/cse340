const invModel = require("../models/inventory-model");
const utilities = require("../utilities");

const invCont = {};

/* ********************
 * Build inventory by classification view
 * ******************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
};

/* ********************
 * Build inventory by inventory view
 * ******************** */
invCont.buildByInventoryId = async function (req, res, next) {
  const inv_id = req.params.invId;
  const data = await invModel.getInventoryByInventoryId(inv_id);
  const grid = await utilities.buildInventoryGrid(data);
  let nav = await utilities.getNav();
  const make = data[0].inv_make;
  const model = data[0].inv_model;
  res.render("./inventory/vehicleDetail", {
    title: make + " " + model,
    nav,
    grid,
  });
};

/* ********************
 * Build management view
 * ******************** */
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav();
  const list = await utilities.buildClassificationList();
  res.render("./inventory/management", {
    title: "Management",
    nav,
    list,
    errors: null,
  });
};

/* ********************
 * Build add classification view
 * ******************** */
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("./inventory/addClassification", {
    title: "Add Classification",
    nav,
    errors: null,
  });
};

/* ********************
 * Build add inventory view
 * ******************** */
invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  const list = await utilities.buildClassificationList();
  res.render("./inventory/addInventory", {
    title: "Add Inventory",
    nav,
    list,
    errors: null,
  });
};

/* ********************
 * Process adding classification
 * ******************** */
invCont.addClassification = async function (req, res, next) {
  let nav = await utilities.getNav();
  const classification_name = req.body;
  const classResult = await invModel.addClassification(classification_name);
  if (classResult) {
    req.flash(
      "notice",
      `You have added ${classification_name} classification.`
    );
    res.status(201).render("inventory/management", {
      title: "Management",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, unable to add classification.");
    res.status(501).render("inventory/addClassification", {
      title: "Add Classification",
      nav,
      errors,
    });
  }
};

/* ********************
 * Process adding classification
 * ******************** */
invCont.addInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
  } = req.body;
  const invResult = await invModel.addInventory(
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color
  );
  if (invResult) {
    req.flash(
      "notice",
      `You have added ${inv_make} ${inv_model} to the inventory.`
    );
    res.status(201).render("inventory/management", {
      title: "Management",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, unable to add inventory.");
    res.status(501).render("inventory/addInventory", {
      title: "Add Inventory",
      nav,
      errors,
    });
  }
};

/* ********************
 * Return inventory by Classification As JSON
 * ******************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id);
  const invData = await invModel.getInventoryByClassificationId(
    classification_id
  );
  if (invData[0].inv_id) {
    return res.json(invData);
  } else {
    next(new Error("No data returned"));
  }
};

/* ********************
 * Build edit inventory view
 * ******************** */
invCont.buildEditInventory = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();
  const data = await invModel.getInventoryByInventoryId(inv_id);
  const list = await utilities.buildClassificationList();
  const itemName = `${data.inv_make} ${data.inv_model}`;
  console.log(data.inv_make);
  console.log(data.inv_model);
  res.render("./inventory/editInventory", {
    title: "Edit " + itemName,
    nav,
    list: list,
    errors: null,
    inv_id: data.inv_id,
    inv_make: data.inv_make,
    inv_model: data.inv_model,
    inv_year: data.inv_year,
    inv_description: data.inv_description,
    inv_image: data.inv_image,
    inv_thumbnail: data.inv_thumbnail,
    inv_price: data.inv_price,
    inv_miles: data.inv_miles,
    inv_color: data.inv_color,
    classification_id: data.classification_id,
  });
};

// Error in footer
invCont.buildFootError = async function (req, res, next) {
  const message = "Sorry, we are experiencing internal server issues.";
  res.render("./inventory/detailErr", {
    title: "500 Error",
    message,
    nav,
  });
};

module.exports = invCont;
