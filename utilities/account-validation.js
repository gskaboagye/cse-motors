const { body, validationResult } = require("express-validator")
const utilities = require(".")
const accountModel = require("../models/account-model")

const validate = {}

/* ******************************
 * Registration data rules
 * ***************************** */
validate.registrationRules = () => {
  return [
    body("account_firstname")
      .trim()
      .notEmpty()
      .withMessage("Please provide a first name."),

    body("account_lastname")
      .trim()
      .notEmpty()
      .withMessage("Please provide a last name."),

    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("Please provide a valid email address.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(account_email)
        if (emailExists) {
          throw new Error("Email already exists. Please use a different email address.")
        }
      }),

    body("account_password")
      .trim()
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{12,}$/)
      .withMessage(
        "Password must be at least 12 characters and contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 symbol."
      ),
  ]
}

/* ******************************
 * Check registration data
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    return res.render("account/register", {
      title: "Register",
      nav,
      errors,
      account_firstname,
      account_lastname,
      account_email,
    })
  }
  next()
}

/* ******************************
 * Login rules
 * ***************************** */
validate.loginRules = () => {
  return [
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("Please provide a valid email address."),

    body("account_password")
      .trim()
      .notEmpty()
      .withMessage("Please provide a password."),
  ]
}

/* ******************************
 * Check login data
 * ***************************** */
validate.checkLoginData = async (req, res, next) => {
  const { account_email } = req.body
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    return res.render("account/login", {
      title: "Login",
      nav,
      errors,
      account_email,
    })
  }
  next()
}

/* ******************************
 * Update account rules
 * ***************************** */
validate.updateRules = () => {
  return [
    body("account_firstname")
      .trim()
      .notEmpty()
      .withMessage("Please provide a first name."),

    body("account_lastname")
      .trim()
      .notEmpty()
      .withMessage("Please provide a last name."),

    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("Please provide a valid email address.")
      .custom(async (account_email, { req }) => {
        const account_id = parseInt(req.body.account_id)
        const existingAccount = await accountModel.getAccountByEmail(account_email)
        if (existingAccount && existingAccount.account_id !== account_id) {
          throw new Error("Email already exists. Please use a different email address.")
        }
      }),
  ]
}

/* ******************************
 * Check update data
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
  const { account_id, account_firstname, account_lastname, account_email } = req.body
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    return res.render("account/update", {
      title: "Update Account",
      nav,
      errors,
      account_id,
      account_firstname,
      account_lastname,
      account_email,
    })
  }
  next()
}

/* ******************************
 * Password rules
 * ***************************** */
validate.passwordRules = () => {
  return [
    body("account_password")
      .trim()
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{12,}$/)
      .withMessage(
        "Password must be at least 12 characters and contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 symbol."
      ),
  ]
}

/* ******************************
 * Check password data
 * ***************************** */
validate.checkPasswordData = async (req, res, next) => {
  const { account_id } = req.body
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    const accountData = await accountModel.getAccountById(account_id)

    return res.render("account/update", {
      title: "Update Account",
      nav,
      errors,
      account_id: accountData.account_id,
      account_firstname: accountData.account_firstname,
      account_lastname: accountData.account_lastname,
      account_email: accountData.account_email,
    })
  }
  next()
}

module.exports = validate