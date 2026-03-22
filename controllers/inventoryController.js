const invModel = require("../models/inventory-model");
const utilities = require("../utilities");

// Build inventory by classification view
async function buildByClassificationId(req, res, next) {
  try {
    const classification_id = req.params.classificationId;

    const data = await invModel.getInventoryByClassificationId(classification_id);

    if (!data || data.length === 0) {
      const err = new Error("No vehicles found for this classification");
      err.status = 404;
      throw err;
    }

    let grid = '<ul class="classification-grid">';

    data.forEach(vehicle => {
      grid += `
        <li>
          <a href="/inv/detail/${vehicle.inv_id}">
            ${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}
          </a>
        </li>
      `;
    });

    grid += "</ul>";

    res.render("inventory/classification", {
      title: data[0].classification_name || "Vehicle Classification",
      grid
    });
  } catch (error) {
    next(error);
  }
}

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

    const detailHTML = utilities.buildVehicleDetail(data);

    res.render("inventory/detail", {
      title: `${data.inv_make} ${data.inv_model}`,
      detailHTML
    });
  } catch (error) {
    next(error);
  }
}

// Intentional 500 error
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