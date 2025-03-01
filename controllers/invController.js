const invModel = require("../models/inventory-model")
const utilities = require("../utilities")

const invCont = {}

/* ********************
 * Build inventory by classification view
 * ******************** */
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
    })
}

/* ********************
 * Build inventory by inventory view
 * ******************** */
invCont.buildByInventoryId = async function (req, res, next) {
    const inv_id = req.params.invId
    const data = await invModel.getInventoryByInventoryId(inv_id)
    const grid = await utilities.buildInventoryGrid(data)
    let nav = await utilities.getNav()
    const make = data[0].inv_make
    const model = data[0].inv_model
    res.render("./inventory/vehicleDetail", {
        title: make + ' ' + model,
        nav,
        grid,
    })
}

/* ********************
 * Build management view
 * ******************** */
invCont.buildManagement = async function(req, res, next) {
    let nav = await utilities.getNav()
    const grid = await utilities.buildManagementGrid()
    res.render("./inventory/management", {
        title: 'Management',
        nav,
        grid,
    })
}

// Error in footer
invCont.buildFootError = async function (req, res, next) {
    const message = 'Sorry, we are experiencing internal server issues.'
    res.render("./inventory/detailErr", {
        title: '500 Error',
        message,
        nav,
    })
}

module.exports = invCont