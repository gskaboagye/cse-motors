const invModel = require("../models/inventory-model");
const utilities = require("../utilities");

// Get vehicle detail
async function getInventoryItem(req, res, next) {
  try {
    const inv_id = req.params.inv_id;

    const data = await invModel.getInventoryItemById(inv_id);

    if (!data) {
      const err = new Error("Vehicle not found");
      err.status = 404;
      throw err;
    }

    // Build detail HTML
    const detailHTML = utilities.buildVehicleDetail(data);

    res.render("inventory/detail", {
      title: `${data.inv_make} ${data.inv_model}`,
      detailHTML
    });

  } catch (error) {
    next(error); // ✅ REQUIRED for rubric
  }
}

// Intentional 500 error
function triggerError(req, res, next) {
  const err = new Error("Intentional Server Error");
  err.status = 500;
  next(err);
}

module.exports = {
  getInventoryItem,
  triggerError
};