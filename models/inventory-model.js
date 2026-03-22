const pool = require("../database");

// Get vehicle by ID (Parameterized query)
async function getInventoryItemById(inv_id) {
  try {
    const sql = "SELECT * FROM inventory WHERE inv_id = $1";
    const result = await pool.query(sql, [inv_id]);

    if (result.rows.length === 0) {
      return null; // important for controller check
    }

    return result.rows[0];
  } catch (error) {
    console.error("Database error:", error);
    throw error;
  }
}

module.exports = {
  getInventoryItemById
};