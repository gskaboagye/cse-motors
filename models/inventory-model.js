const pool = require("../database");

// ================================
// GET VEHICLE BY ID
// ================================
async function getInventoryItemById(inv_id) {
  try {
    const sql = "SELECT * FROM inventory WHERE inv_id = $1";
    const result = await pool.query(sql, [inv_id]);

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  } catch (error) {
    console.error("Database error:", error);
    throw error;
  }
}

// ================================
// GET VEHICLES BY CLASSIFICATION
// ================================
async function getInventoryByClassificationId(classification_id) {
  try {
    const sql = `
      SELECT i.*, c.classification_name
      FROM inventory AS i
      JOIN classification AS c
      ON i.classification_id = c.classification_id
      WHERE i.classification_id = $1
    `;

    const result = await pool.query(sql, [classification_id]);

    return result.rows;
  } catch (error) {
    console.error("Database error:", error);
    throw error;
  }
}

// ================================
// EXPORTS
// ================================
module.exports = {
  getInventoryItemById,
  getInventoryByClassificationId
};