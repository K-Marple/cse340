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
  const reviewData = await invModel.getReviewsByInvId(inv_id);
  const existingReviews = await utilities.buildReviewList(reviewData.rows);
  res.render("./inventory/vehicleDetail", {
    title: make + " " + model,
    nav,
    grid,
    existingReviews,
  });
};

/* ********************
 * Build management view
 * ******************** */
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav();
  const classificationSelect = await utilities.buildClassificationList();
  res.render("./inventory/management", {
    title: "Management",
    nav,
    classificationSelect,
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
  const classificationSelect = await utilities.buildClassificationList();
  res.render("./inventory/addInventory", {
    title: "Add Inventory",
    nav,
    classificationSelect,
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
 * Process adding inventory
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
    const classificationSelect = await utilities.buildClassificationList(
      classification_id
    );
    req.flash(
      "notice",
      `You have added ${inv_make} ${inv_model} to the inventory.`
    );
    res.status(201).render("inventory/management", {
      title: "Management",
      nav,
      errors: null,
      classificationSelect,
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
  const classificationSelect = await utilities.buildClassificationList(
    data[0].classification_id
  );
  const itemName = `${data[0].inv_make} ${data[0].inv_model}`;
  res.render("./inventory/editInventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect,
    errors: null,
    inv_id: data[0].inv_id,
    inv_make: data[0].inv_make,
    inv_model: data[0].inv_model,
    inv_year: data[0].inv_year,
    inv_description: data[0].inv_description,
    inv_image: data[0].inv_image,
    inv_thumbnail: data[0].inv_thumbnail,
    inv_price: data[0].inv_price,
    inv_miles: data[0].inv_miles,
    inv_color: data[0].inv_color,
    classification_id: data[0].classification_id,
  });
};

/* ********************
 * Process updating inventory
 * ******************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  const {
    inv_id,
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
  const updateResult = await invModel.updateInventory(
    inv_id,
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
  if (updateResult) {
    const itemName = inv_make + " " + inv_model;
    req.flash("notice", `The ${itemName} was sucessfully updated.`);
    res.redirect("/inv/");
  } else {
    const classificationSelect = await utilities.buildClassificationList(
      classification_id
    );
    req.flash("notice", "Sorry, the insert failed.");
    res.status(501).render("inventory/editInventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect,
      errors: null,
      inv_id,
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
    });
  }
};

/* ********************
 * Build delete inventory view
 * ******************** */
invCont.buildDeleteInventory = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();
  const data = await invModel.getInventoryByInventoryId(inv_id);
  const itemName = `${data[0].inv_make} ${data[0].inv_model}`;
  res.render("./inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id: data[0].inv_id,
    inv_make: data[0].inv_make,
    inv_model: data[0].inv_model,
    inv_year: data[0].inv_year,
    inv_price: data[0].inv_price,
  });
};

/* ********************
 * Process deleting inventory
 * ******************** */
invCont.deleteInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  const inv_id = parseInt(req.body.inv_id);
  const deleteResult = await invModel.deleteInventoryItem(inv_id);
  const data = await invModel.getInventoryByInventoryId(inv_id);
  const itemName = `${data.inv_make} ${data.inv_model}`;
  if (deleteResult) {
    req.flash("notice", `The ${itemName} was sucessfully deleted.`);
    res.redirect("/inv/");
  } else {
    req.flash("notice", "Sorry, we were unable to process the deletion.");
    res.status(501).render("inventory/delete-confirm", {
      title: "Delete " + itemName,
      nav,
      errors: null,
      inv_id,
      inv_make: data[0].inv_make,
      inv_model: data[0].inv_model,
      inv_year: data[0].inv_year,
      inv_price: data[0].inv_price,
    });
  }
};

// Error in footer
invCont.buildFootError = async function (req, res, next) {
  const message = "Sorry, we are experiencing internal server issues.";
  res.render("/inventory/detailErr", {
    title: "500 Error",
    message,
    nav,
  });
};

module.exports = invCont;
