const pool = require("../database");

// ================================
// GET ALL CLASSIFICATIONS
// ================================
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

// ================================
// INSERT NEW CLASSIFICATION
// ================================
async function insertClassification(classification_name) {
  try {
    const sql = `
      INSERT INTO classification (classification_name)
      VALUES ($1)
      RETURNING *;
    `;
    const result = await pool.query(sql, [classification_name]);
    return result.rows[0];
  } catch (error) {
    console.error("Database error:", error);
    return null;
  }
}

// ================================
// INSERT NEW INVENTORY ITEM
// ================================
async function insertInventory(data) {
  try {
    const sql = `
      INSERT INTO inventory (
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING *;
    `;

    const values = [
      data.inv_make,
      data.inv_model,
      data.inv_year,
      data.inv_description,
      data.inv_image,
      data.inv_thumbnail,
      data.inv_price,
      data.inv_miles,
      data.inv_color,
      data.classification_id
    ];

    const result = await pool.query(sql, values);
    return result.rows[0];
  } catch (error) {
    console.error("Database error:", error);
    return null;
  }
}

// ================================
// GET VEHICLE BY ID
// ================================
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
      ORDER BY i.inv_make, i.inv_model
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
  getClassifications,
  insertClassification,
  insertInventory,
  getInventoryItemById,
  getInventoryByClassificationId
};