// Build navigation
async function getNav() {
  return `
  <nav role="navigation" aria-label="Main site navigation">
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="/inv/detail/1">Sample Vehicle</a></li>
    </ul>
  </nav>`;
}

// Build vehicle detail HTML
function buildVehicleDetail(vehicle) {
  return `
    <div class="vehicle-detail">
      <div class="vehicle-image">
        <img 
          src="${vehicle.inv_image}" 
          alt="Image of ${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}"
        >
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
}

module.exports = {
  getNav,
  buildVehicleDetail
};