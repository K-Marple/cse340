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
    const inventory_id = req.params.inventoryId
    const data = await invModel.getInventoryByInventoryId(inv_id)
    const grid = await utilities.buildInventoryGrid(data)
    const make = data[0].inventory_id
    const model = data[0].inventory_id
    res.render("./inventory/vehicleDetail", {
        title: make + model,
        grid,
    })
}

module.exports = invCont