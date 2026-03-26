const invModel = require("../models/inventory-model");

const Util = {};

// ================================
// BUILD DYNAMIC NAVIGATION
// ================================
Util.getNav = async function () {
  const data = await invModel.getClassifications();

  let list = "<ul>";
  list += '<li><a href="/" title="Home page">Home</a></li>';

  data.forEach((row) => {
    list += `
      <li>
        <a href="/inv/type/${row.classification_id}" 
           title="See our inventory of ${row.classification_name} vehicles">
          ${row.classification_name}
        </a>
      </li>`;
  });

  list += "</ul>";
  return list;
};

// ================================
// BUILD CLASSIFICATION GRID
// ================================
Util.buildClassificationGrid = async function (data) {
  let grid;

  if (data.length > 0) {
    grid = '<ul id="inv-display">';

    data.forEach((vehicle) => {
      grid += `
        <li>
          <a href="/inv/detail/${vehicle.inv_id}" 
             title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
            <img src="${vehicle.inv_thumbnail}" 
                 alt="Image of ${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors">
          </a>
          <div class="namePrice">
            <hr>
            <h2>
              <a href="/inv/detail/${vehicle.inv_id}" 
                 title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
                ${vehicle.inv_make} ${vehicle.inv_model}
              </a>
            </h2>
            <span>$${new Intl.NumberFormat("en-US").format(vehicle.inv_price)}</span>
          </div>
        </li>`;
    });

    grid += "</ul>";
  } else {
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }

  return grid;
};

// ================================
// BUILD VEHICLE DETAIL HTML
// ================================
Util.buildVehicleDetail = function (vehicle) {
  return `
    <div class="vehicle-detail">
      <div class="vehicle-image">
        <img 
          src="${vehicle.inv_image}" 
          alt="Image of ${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}">
      </div>

      <div class="vehicle-info">
        <h2>${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</h2>

        <p class="price">
          <strong>Price:</strong>
          ${new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD"
          }).format(vehicle.inv_price)}
        </p>

        <p class="mileage">
          <strong>Mileage:</strong>
          ${new Intl.NumberFormat("en-US").format(vehicle.inv_miles)} miles
        </p>

        <p><strong>Color:</strong> ${vehicle.inv_color}</p>
        <p><strong>Description:</strong> ${vehicle.inv_description}</p>
      </div>
    </div>
  `;
};

module.exports = Util;