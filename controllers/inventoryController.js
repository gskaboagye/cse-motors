const invModel = require("../models/inventory-model");
const utilities = require("../utilities");

// ============================
// Get Vehicle Detail Controller
// ============================
async function getInventoryItem(req, res, next) {
  try {
    const inv_id = req.params.inv_id;

    // Get vehicle data from model
    const data = await invModel.getInventoryItemById(inv_id);

    // If no vehicle found, throw 404 error
    if (!data) {
      const err = new Error("Vehicle not found");
      err.status = 404;
      throw err;
    }

    // Build navigation and vehicle detail HTML using utility functions
    const nav = await utilities.getNav();
    const detailHTML = utilities.buildVehicleDetail(data);

    // Render vehicle detail page
    res.render("inventory/detail", {
      title: `${data.inv_make} ${data.inv_model}`,
      nav,
      detailHTML
    });

  } catch (error) {
    // Pass error to global error handler
    next(error);
  }
}

// ============================
// Intentional 500 Error Controller
// For rubric-required footer error testing
// ============================
function triggerError(req, res, next) {
  const err = new Error("Intentional Server Error");
  err.status = 500;
  next(err);
}

module.exports = {
  getInventoryItem,
  triggerError
};