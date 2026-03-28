const invModel = require("../models/inventory-model");
const utilities = require("../utilities");

// ================================
// MANAGEMENT VIEW
// ================================
async function buildManagementView(req, res) {
  res.render("inventory/management", {
    title: "Inventory Management",
    messages: req.flash ? req.flash("notice") : null
  });
}

// ================================
// ADD CLASSIFICATION VIEW
// ================================
async function buildAddClassification(req, res) {
  res.render("inventory/add-classification", {
    title: "Add Classification",
    messages: req.flash ? req.flash("notice") : null
  });
}

// ================================
// PROCESS ADD CLASSIFICATION
// ================================
async function addClassification(req, res, next) {
  try {
    const { classification_name } = req.body;

    if (!classification_name || !classification_name.trim()) {
      if (req.flash) req.flash("notice", "Classification name is required.");
      return res.redirect("/inv/add-classification");
    }

    const result = await invModel.insertClassification(classification_name.trim());

    if (result) {
      if (req.flash) req.flash("notice", "Classification added successfully.");
      return res.redirect("/inv/");
    }

    if (req.flash) req.flash("notice", "Failed to add classification.");
    return res.redirect("/inv/add-classification");
  } catch (error) {
    next(error);
  }
}

// ================================
// ADD INVENTORY VIEW
// ================================
async function buildAddInventory(req, res, next) {
  try {
    const classificationList = await utilities.buildClassificationList();

    res.render("inventory/add-inventory", {
      title: "Add Inventory",
      classificationList,
      messages: req.flash ? req.flash("notice") : null,
      inv_make: "",
      inv_model: "",
      inv_year: "",
      inv_description: "",
      inv_image: "",
      inv_thumbnail: "",
      inv_price: "",
      inv_miles: "",
      inv_color: "",
      classification_id: ""
    });
  } catch (error) {
    next(error);
  }
}

// ================================
// PROCESS ADD INVENTORY
// ================================
async function addInventory(req, res, next) {
  try {
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
      classification_id
    } = req.body;

    inv_make = inv_make ? inv_make.trim() : "";
    inv_model = inv_model ? inv_model.trim() : "";
    inv_description = inv_description ? inv_description.trim() : "";
    inv_image = inv_image ? inv_image.trim() : "";
    inv_thumbnail = inv_thumbnail ? inv_thumbnail.trim() : "";
    inv_color = inv_color ? inv_color.trim() : "";

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
      const classificationList = await utilities.buildClassificationList(classification_id);

      return res.render("inventory/add-inventory", {
        title: "Add Inventory",
        classificationList,
        messages: "All required fields must be completed.",
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id
      });
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
      classification_id: parseInt(classification_id)
    });

    if (result) {
      if (req.flash) req.flash("notice", "Vehicle added successfully.");
      return res.redirect("/inv/");
    }

    const classificationList = await utilities.buildClassificationList(classification_id);

    return res.render("inventory/add-inventory", {
      title: "Add Inventory",
      classificationList,
      messages: "Failed to add inventory item.",
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    });
  } catch (error) {
    next(error);
  }
}

// ================================
// BUILD INVENTORY BY CLASSIFICATION
// ================================
async function buildByClassificationId(req, res, next) {
  try {
    const classification_id = req.params.classificationId;

    const data = await invModel.getInventoryByClassificationId(classification_id);
    const classifications = await invModel.getClassifications();

    const selectedClassification = classifications.find(
      (c) => c.classification_id == classification_id
    );

    const className = selectedClassification
      ? selectedClassification.classification_name
      : "Vehicle Classification";

    const grid = await utilities.buildClassificationGrid(data);

    res.render("inventory/classification", {
      title: `${className} vehicles`,
      grid
    });
  } catch (error) {
    next(error);
  }
}

// ================================
// GET VEHICLE DETAIL
// ================================
async function getInventoryItem(req, res, next) {
  try {
    const inv_id = req.params.inv_id;

    const data = await invModel.getInventoryItemById(inv_id);

    if (!data) {
      const err = new Error("Vehicle not found");
      err.status = 404;
      throw err;
    }

    const detailHTML = utilities.buildVehicleDetail(data);

    res.render("inventory/detail", {
      title: `${data.inv_make} ${data.inv_model}`,
      detailHTML
    });
  } catch (error) {
    next(error);
  }
}

// ================================
// INTENTIONAL 500 ERROR
// ================================
function triggerError(req, res, next) {
  const err = new Error("Intentional Server Error");
  err.status = 500;
  next(err);
}

module.exports = {
  buildManagementView,
  buildAddClassification,
  addClassification,
  buildAddInventory,
  addInventory,
  buildByClassificationId,
  getInventoryItem,
  triggerError
};