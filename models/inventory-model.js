const pool = require("../database");

async function getClassifications() {
  try {
    const sql = "SELECT * FROM classification ORDER BY classification_name";
    const result = await pool.query(sql);
    return result.rows;
  } catch (error) {
    console.error("Database error:", error);
    throw error;
  }
}

async function getInventoryItemById(inv_id) {
  try {
    const sql = `
      SELECT i.*, c.classification_name
      FROM inventory AS i
      JOIN classification AS c
      ON i.classification_id = c.classification_id
      WHERE i.inv_id = $1
    `;
    const result = await pool.query(sql, [inv_id]);
    return result.rows[0] || null;
  } catch (error) {
    console.error("Database error:", error);
    throw error;
  }
}

async function getInventoryByClassificationId(classification_id) {
  try {
    const sql = `
      SELECT i.*, c.classification_name
      FROM inventory AS i
      JOIN classification AS c
      ON i.classification_id = c.classification_id
      WHERE i.classification_id = $1
      ORDER BY i.inv_make, i.inv_model
    `;
    const result = await pool.query(sql, [classification_id]);
    return result.rows;
  } catch (error) {
    console.error("Database error:", error);
    throw error;
  }
}

module.exports = {
  getClassifications,
  getInventoryItemById,
  getInventoryByClassificationId
};