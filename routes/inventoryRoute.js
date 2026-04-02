const express = require("express")
const router = express.Router()
const invController = require("../controllers/inventoryController")
const utilities = require("../utilities/")

// ================================
// MANAGEMENT VIEW
// URL: /inv/
// Restricted to Employee/Admin
// ================================
router.get(
  "/",
  utilities.checkLogin,
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildManagementView)
)

// ================================
// ADD CLASSIFICATION VIEW
// URL: /inv/add-classification
// Restricted to Employee/Admin
// ================================
router.get(
  "/add-classification",
  utilities.checkLogin,
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildAddClassification)
)

// ================================
// PROCESS ADD CLASSIFICATION
// URL: /inv/add-classification
// Restricted to Employee/Admin
// ================================
router.post(
  "/add-classification",
  utilities.checkLogin,
  utilities.checkAccountType,
  utilities.handleErrors(invController.addClassification)
)

// ================================
// ADD INVENTORY VIEW
// URL: /inv/add-inventory
// Restricted to Employee/Admin
// ================================
router.get(
  "/add-inventory",
  utilities.checkLogin,
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildAddInventory)
)

// ================================
// PROCESS ADD INVENTORY
// URL: /inv/add-inventory
// Restricted to Employee/Admin
// ================================
router.post(
  "/add-inventory",
  utilities.checkLogin,
  utilities.checkAccountType,
  utilities.handleErrors(invController.addInventory)
)

// ================================
// CLASSIFICATION ROUTE
// URL: /inv/type/:classificationId
// Public route
// ================================
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
)

// ================================
// VEHICLE DETAIL ROUTE
// URL: /inv/detail/:inv_id
// Public route
// ================================
router.get(
  "/detail/:inv_id",
  utilities.handleErrors(invController.getInventoryItem)
)

// ================================
// INTENTIONAL 500 ERROR ROUTE
// URL: /inv/error
// Public test route
// ================================
router.get(
  "/error",
  utilities.handleErrors(invController.triggerError)
)

module.exports = router