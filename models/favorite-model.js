const pool = require("../database/")

async function addFavorite(account_id, inv_id) {
  try {
    const sql = `
      INSERT INTO favorite (account_id, inv_id)
      VALUES ($1, $2)
      RETURNING *;
    `
    const result = await pool.query(sql, [account_id, inv_id])
    return result.rows[0]
  } catch (error) {
    console.error("addFavorite error:", error)
    return null
  }
}

async function getFavoritesByAccountId(account_id) {
  try {
    const sql = `
      SELECT
        f.favorite_id,
        f.account_id,
        f.inv_id,
        i.inv_make,
        i.inv_model,
        i.inv_year,
        i.inv_thumbnail,
        i.inv_price,
        i.inv_miles,
        i.inv_color
      FROM favorite f
      JOIN inventory i
        ON f.inv_id = i.inv_id
      WHERE f.account_id = $1
      ORDER BY f.created_at DESC;
    `
    const result = await pool.query(sql, [account_id])
    return result.rows
  } catch (error) {
    console.error("getFavoritesByAccountId error:", error)
    return []
  }
}

async function removeFavorite(favorite_id, account_id) {
  try {
    const sql = `
      DELETE FROM favorite
      WHERE favorite_id = $1
        AND account_id = $2
      RETURNING *;
    `
    const result = await pool.query(sql, [favorite_id, account_id])
    return result.rows[0]
  } catch (error) {
    console.error("removeFavorite error:", error)
    return null
  }
}

async function checkExistingFavorite(account_id, inv_id) {
  try {
    const sql = `
      SELECT favorite_id
      FROM favorite
      WHERE account_id = $1
        AND inv_id = $2;
    `
    const result = await pool.query(sql, [account_id, inv_id])
    return result.rows[0]
  } catch (error) {
    console.error("checkExistingFavorite error:", error)
    return null
  }
}

module.exports = {
  addFavorite,
  getFavoritesByAccountId,
  removeFavorite,
  checkExistingFavorite,
}