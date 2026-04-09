const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const Util = {}

// ================================
// BUILD DYNAMIC NAVIGATION
// ================================
Util.getNav = async function () {
  const data = await invModel.getClassifications()

  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'

  data.forEach((row) => {
    list += `
      <li>
        <a href="/inv/type/${row.classification_id}" 
           title="See our inventory of ${row.classification_name} vehicles">
          ${row.classification_name}
        </a>
      </li>`
  })

  list += "</ul>"
  return list
}

// ================================
// ERROR HANDLER WRAPPER
// ================================
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next)

// ================================
// CHECK JWT TOKEN
// ================================
Util.checkJWTToken = (req, res, next) => {
  const token = req.cookies ? req.cookies.jwt : null

  if (!token) {
    res.locals.loggedin = false
    res.locals.accountData = null
    return next()
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    res.locals.loggedin = true
    res.locals.accountData = decoded
    return next()
  } catch (error) {
    console.error("JWT verification error:", error.message)
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    })
    res.locals.loggedin = false
    res.locals.accountData = null
    return next()
  }
}

// ================================
// CHECK LOGIN
// ================================
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    return next()
  }
  req.flash("notice", "Please log in.")
  return res.redirect("/account/login")
}

// ================================
// CHECK ACCOUNT TYPE
// ONLY EMPLOYEE OR ADMIN
// ================================
Util.checkAccountType = (req, res, next) => {
  if (
    res.locals.accountData &&
    (res.locals.accountData.account_type === "Employee" ||
      res.locals.accountData.account_type === "Admin")
  ) {
    return next()
  }

  req.flash("notice", "You do not have permission to access that area.")
  return res.redirect("/account/login")
}

// ================================
// BUILD CLASSIFICATION GRID
// ================================
Util.buildClassificationGrid = async function (data) {
  let grid

  if (data.length > 0) {
    grid = '<ul id="inv-display">'

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
        </li>`
    })

    grid += "</ul>"
  } else {
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }

  return grid
}

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
  `
}

// ================================
// BUILD CLASSIFICATION LIST
// ================================
Util.buildClassificationList = async function (classification_id = null) {
  const data = await invModel.getClassifications()

  let classificationList =
    '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"

  data.forEach((row) => {
    classificationList += `<option value="${row.classification_id}" ${
      classification_id == row.classification_id ? "selected" : ""
    }>${row.classification_name}</option>`
  })

  classificationList += "</select>"
  return classificationList
}

module.exports = Util