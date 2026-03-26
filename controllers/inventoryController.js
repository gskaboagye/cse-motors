const invModel = require("../models/inventory-model");
const utilities = require("../utilities");

async function buildByClassificationId(req, res, next) {
  try {
    const classification_id = req.params.classificationId;
    const data = await invModel.getInventoryByClassificationId(classification_id);

    if (!data || data.length === 0) {
      const err = new Error("No vehicles found for this classification.");
      err.status = 404;
      throw err;
    }

    const grid = await utilities.buildClassificationGrid(data);

    res.render("inventory/classification", {
      title: `${data[0].classification_name} vehicles`,
      grid
    });
  } catch (error) {
    next(error);
  }
}

async function getInventoryItem(req, res, next) {
  try {
    const inv_id = req.params.inv_id;
    const data = await invModel.getInventoryItemById(inv_id);

    if (!data) {
      const err = new Error(`Vehicle with id ${inv_id} not found`);
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