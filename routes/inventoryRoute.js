const express = require("express");
const router = express.Router();
const invController = require("../controllers/inventoryController");

// ================================
// MANAGEMENT VIEW
// URL: /inv/
// ================================
router.get("/", invController.buildManagementView);

// ================================
// ADD CLASSIFICATION VIEW
// URL: /inv/add-classification
// ================================
router.get("/add-classification", invController.buildAddClassification);

// ================================
// PROCESS ADD CLASSIFICATION
// URL: /inv/add-classification
// ================================
router.post("/add-classification", invController.addClassification);

// ================================
// ADD INVENTORY VIEW
// URL: /inv/add-inventory
// ================================
router.get("/add-inventory", invController.buildAddInventory);

// ================================
// PROCESS ADD INVENTORY
// URL: /inv/add-inventory
// ================================
router.post("/add-inventory", invController.addInventory);

// ================================
// CLASSIFICATION ROUTE
// URL: /inv/type/:classificationId
// ================================
router.get("/type/:classificationId", invController.buildByClassificationId);

// ================================
// VEHICLE DETAIL ROUTE
// URL: /inv/detail/:inv_id
// ================================
router.get("/detail/:inv_id", invController.getInventoryItem);

// ================================
// INTENTIONAL 500 ERROR ROUTE
// URL: /inv/error
// ================================
router.get("/error", invController.triggerError);

module.exports = router;