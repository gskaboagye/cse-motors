const express = require("express");
const router = express.Router();
const invController = require("../controllers/inventoryController");

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