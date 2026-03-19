const express = require("express");
const router = express.Router();
const invController = require("../controllers/inventoryController");

// ============================
// Vehicle Detail Route
// Handles request for a specific vehicle by ID
// ============================
router.get("/detail/:inv_id", invController.getInventoryItem);

// ============================
// Intentional Footer-based Error Route
// Required for rubric testing of error handling
// ============================
router.get("/error", invController.triggerError);

// ============================
// 404 handler (optional, can be in app.js)
// ============================
// router.use((req, res, next) => {
//   const err = new Error("Page Not Found");
//   err.status = 404;
//   next(err);
// });

module.exports = router;