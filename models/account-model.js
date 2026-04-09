const pool = require("../database/")

/* *****************************
 * Register new account
 * *************************** */
async function registerAccount(
  account_firstname,
  account_lastname,
  account_email,
  account_password
) {
  try {
    const sql = `
      INSERT INTO account (
        account_firstname,
        account_lastname,
        account_email,
        account_password,
        account_type
      )
      VALUES ($1, $2, $3, $4, 'Client')
      RETURNING account_id, account_firstname, account_lastname, account_email, account_type
    `
    const result = await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_password,
    ])
    return result.rows[0]
  } catch (error) {
    console.error("registerAccount error:", error)
    return null
  }
}

/* *****************************
 * Check for existing email
 * *************************** */
async function checkExistingEmail(account_email) {
  try {
    const sql = `
      SELECT account_id
      FROM account
      WHERE account_email = $1
    `
    const result = await pool.query(sql, [account_email])
    return result.rowCount > 0
  } catch (error) {
    console.error("checkExistingEmail error:", error)
    return false
  }
}

/* *****************************
 * Get account by email
 * *************************** */
async function getAccountByEmail(account_email) {
  try {
    const sql = `
      SELECT
        account_id,
        account_firstname,
        account_lastname,
        account_email,
        account_password,
        account_type
      FROM account
      WHERE account_email = $1
    `
    const result = await pool.query(sql, [account_email])
    return result.rows[0]
  } catch (error) {
    console.error("getAccountByEmail error:", error)
    return null
  }
}

/* *****************************
 * Get account by id
 * *************************** */
async function getAccountById(account_id) {
  try {
    const sql = `
      SELECT
        account_id,
        account_firstname,
        account_lastname,
        account_email,
        account_type
      FROM account
      WHERE account_id = $1
    `
    const result = await pool.query(sql, [account_id])
    return result.rows[0]
  } catch (error) {
    console.error("getAccountById error:", error)
    return null
  }
}

/* *****************************
 * Update account information
 * *************************** */
async function updateAccount(
  account_firstname,
  account_lastname,
  account_email,
  account_id
) {
  try {
    const sql = `
      UPDATE account
      SET
        account_firstname = $1,
        account_lastname = $2,
        account_email = $3
      WHERE account_id = $4
      RETURNING account_id, account_firstname, account_lastname, account_email, account_type
    `
    const result = await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_id,
    ])
    return result.rows[0]
  } catch (error) {
    console.error("updateAccount error:", error)
    return null
  }
}

/* *****************************
 * Update password
 * *************************** */
async function updatePassword(account_password, account_id) {
  try {
    const sql = `
      UPDATE account
      SET account_password = $1
      WHERE account_id = $2
      RETURNING account_id
    `
    const result = await pool.query(sql, [account_password, account_id])
    return result.rows[0]
  } catch (error) {
    console.error("updatePassword error:", error)
    return null
  }
}

module.exports = {
  registerAccount,
  checkExistingEmail,
  getAccountByEmail,
  getAccountById,
  updateAccount,
  updatePassword,
}