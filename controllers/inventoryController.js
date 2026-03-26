const invModel = require("../models/inventory-model");
const utilities = require("../utilities");

// ================================
// BUILD INVENTORY BY CLASSIFICATION
// ================================
async function buildByClassificationId(req, res, next) {
  try {
    const classification_id = req.params.classificationId;

    const data = await invModel.getInventoryByClassificationId(classification_id);
    const classifications = await invModel.getClassifications();

    const selectedClassification = classifications.find(
      c => c.classification_id == classification_id
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
  buildByClassificationId,
  getInventoryItem,
  triggerError
};