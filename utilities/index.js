// Build navigation dynamically
async function getNav() {
  return `
    <nav role="navigation" aria-label="Main site navigation">
      <ul>
        <li><a href="/" aria-label="Home page">Home</a></li>
        <li><a href="/custom" aria-label="Custom vehicles page">Custom</a></li>
        <li><a href="/sedan" aria-label="Sedan vehicles page">Sedan</a></li>
        <li><a href="/suv" aria-label="SUV vehicles page">SUV</a></li>
        <li><a href="/truck" aria-label="Truck vehicles page">Truck</a></li>
        <li><a href="/account" aria-label="My account page">My Account</a></li>
      </ul>
    </nav>
  `;
}

// Build full vehicle detail HTML
function buildVehicleDetail(vehicle) {
  return `
    <section class="vehicle-detail-container" aria-label="Vehicle Details">

      <!-- Vehicle Hero -->
      <article class="vehicle-hero">
        <div class="vehicle-image">
          <img src="${vehicle.inv_image}" 
               alt="${vehicle.inv_make} ${vehicle.inv_model} vehicle image">
        </div>

        <div class="vehicle-info">
          <h2>${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</h2>
          <p><strong>Price:</strong> $${new Intl.NumberFormat("en-US").format(vehicle.inv_price)}</p>
          <p><strong>Mileage:</strong> ${new Intl.NumberFormat("en-US").format(vehicle.inv_miles)} miles</p>
          <p><strong>Color:</strong> ${vehicle.inv_color}</p>
          <p><strong>Description:</strong> ${vehicle.inv_description}</p>
        </div>
      </article>

      <!-- Upgrades Section -->
      ${
        vehicle.upgrades
          ? `<article class="vehicle-upgrades">
              <h3>Upgrades</h3>
              <div class="upgrade-grid">
                ${vehicle.upgrades.map(upg => `
                  <figure>
                    <img src="${upg.image}" alt="${upg.name}">
                    <figcaption><a href="#">${upg.name}</a></figcaption>
                  </figure>
                `).join("")}
              </div>
            </article>`
          : ""
      }

      <!-- Reviews Section -->
      ${
        vehicle.reviews
          ? `<article class="vehicle-reviews">
              <h3>Reviews</h3>
              <ul>
                ${vehicle.reviews.map(r => `<li>"${r.text}" (${r.rating}/5)</li>`).join("")}
              </ul>
            </article>`
          : ""
      }

    </section>
  `;
}

module.exports = {
  getNav,
  buildVehicleDetail
};