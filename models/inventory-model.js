const pool = require("../database/");

// ============================
// Get vehicle by ID using parameterized query (Prepared Statement)
// ============================
async function getInventoryItemById(inv_id) {
  try {
    const sql = "SELECT * FROM inventory WHERE inv_id = $1";
    const result = await pool.query(sql, [inv_id]);

    if (result.rows.length === 0) {
      // No vehicle found, throw a descriptive error
      throw new Error(`Vehicle with ID ${inv_id} not found`);
    }

    // Return vehicle object containing all details
    return result.rows[0];

  } catch (error) {
    // Re-throw for controller to handle
    throw error;
  }
}

module.exports = {
  getInventoryItemById
};