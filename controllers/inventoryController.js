const invModel = require("../models/inventory-model")
const utilities = require("../utilities")

// ================================
// MANAGEMENT VIEW
// ================================
async function buildManagementView(req, res, next) {
  try {
    const nav = await utilities.getNav()

    res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      errors: null,
    })
  } catch (error) {
    next(error)
  }
}

// ================================
// ADD CLASSIFICATION VIEW
// ================================
async function buildAddClassification(req, res, next) {
  try {
    const nav = await utilities.getNav()

    res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
      classification_name: "",
    })
  } catch (error) {
    next(error)
  }
}

// ================================
// PROCESS ADD CLASSIFICATION
// ================================
async function addClassification(req, res, next) {
  try {
    const nav = await utilities.getNav()
    const classification_name = req.body.classification_name
      ? req.body.classification_name.trim()
      : ""

    if (!classification_name) {
      req.flash("notice", "Classification name is required.")
      return res.render("inventory/add-classification", {
        title: "Add Classification",
        nav,
        errors: null,
        classification_name: "",
      })
    }

    const result = await invModel.insertClassification(classification_name)

    if (result) {
      req.flash("notice", "Classification added successfully.")
      return res.redirect("/inv/")
    }

    req.flash("notice", "Failed to add classification.")
    return res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
      classification_name,
    })
  } catch (error) {
    next(error)
  }
}

// ================================
// ADD INVENTORY VIEW
// ================================
async function buildAddInventory(req, res, next) {
  try {
    const nav = await utilities.getNav()
    const classificationList = await utilities.buildClassificationList()

    res.render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationList,
      errors: null,
      inv_make: "",
      inv_model: "",
      inv_year: "",
      inv_description: "",
      inv_image: "",
      inv_thumbnail: "",
      inv_price: "",
      inv_miles: "",
      inv_color: "",
      classification_id: "",
    })
  } catch (error) {
    next(error)
  }
}

// ================================
// PROCESS ADD INVENTORY
// ================================
async function addInventory(req, res, next) {
  try {
    const nav = await utilities.getNav()

    let {
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    } = req.body

    inv_make = inv_make ? inv_make.trim() : ""
    inv_model = inv_model ? inv_model.trim() : ""
    inv_description = inv_description ? inv_description.trim() : ""
    inv_image = inv_image ? inv_image.trim() : ""
    inv_thumbnail = inv_thumbnail ? inv_thumbnail.trim() : ""
    inv_color = inv_color ? inv_color.trim() : ""

    if (
      !inv_make ||
      !inv_model ||
      !inv_year ||
      !inv_description ||
      !inv_price ||
      !inv_miles ||
      !inv_color ||
      !classification_id
    ) {
      const classificationList = await utilities.buildClassificationList(classification_id)
      req.flash("notice", "All required fields must be completed.")

      return res.render("inventory/add-inventory", {
        title: "Add Inventory",
        nav,
        classificationList,
        errors: null,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id,
      })
    }

    const result = await invModel.insertInventory({
      inv_make,
      inv_model,
      inv_year: parseInt(inv_year),
      inv_description,
      inv_image: inv_image || "/images/vehicles/no-image.png",
      inv_thumbnail: inv_thumbnail || "/images/vehicles/no-image-tn.png",
      inv_price: parseFloat(inv_price),
      inv_miles: parseInt(inv_miles),
      inv_color,
      classification_id: parseInt(classification_id),
    })

    if (result) {
      req.flash("notice", "Vehicle added successfully.")
      return res.redirect("/inv/")
    }

    const classificationList = await utilities.buildClassificationList(classification_id)
    req.flash("notice", "Failed to add inventory item.")

    return res.render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationList,
      errors: null,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    })
  } catch (error) {
    next(error)
  }
}

// ================================
// BUILD INVENTORY BY CLASSIFICATION
// ================================
async function buildByClassificationId(req, res, next) {
  try {
    const nav = await utilities.getNav()
    const classification_id = parseInt(req.params.classificationId)

    const inventoryData = await invModel.getInventoryByClassificationId(classification_id)
    const classificationsData = await invModel.getClassifications()

    const inventory = inventoryData.rows ? inventoryData.rows : inventoryData
    const classifications = classificationsData.rows
      ? classificationsData.rows
      : classificationsData

    const selectedClassification = classifications.find(
      (c) => c.classification_id == classification_id
    )

    const className = selectedClassification
      ? selectedClassification.classification_name
      : "Vehicle Classification"

    const grid = await utilities.buildClassificationGrid(inventory)

    res.render("inventory/classification", {
      title: `${className} Vehicles`,
      nav,
      grid,
    })
  } catch (error) {
    next(error)
  }
}

// ================================
// GET VEHICLE DETAIL
// ================================
async function getInventoryItem(req, res, next) {
  try {
    const nav = await utilities.getNav()
    const inv_id = parseInt(req.params.inv_id)

    const data = await invModel.getInventoryItemById(inv_id)

    if (!data) {
      const err = new Error("Vehicle not found")
      err.status = 404
      throw err
    }

    const detailHTML = utilities.buildVehicleDetail(data)

    res.render("inventory/detail", {
      title: `${data.inv_make} ${data.inv_model}`,
      nav,
      detailHTML,
    })
  } catch (error) {
    next(error)
  }
}

// ================================
// INTENTIONAL 500 ERROR
// ================================
function triggerError(req, res, next) {
  const err = new Error("Intentional Server Error")
  err.status = 500
  next(err)
}

module.exports = {
  buildManagementView,
  buildAddClassification,
  addClassification,
  buildAddInventory,
  addInventory,
  buildByClassificationId,
  getInventoryItem,
  triggerError,
}