const accountModel = require("../models/account-model")
const utilities = require("../utilities/")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const accountCont = {}

/* ****************************************
 *  Deliver login view
 * **************************************** */
accountCont.buildLogin = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
    account_email: "",
  })
}

/* ****************************************
 *  Deliver registration view
 * **************************************** */
accountCont.buildRegister = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
    account_firstname: "",
    account_lastname: "",
    account_email: "",
  })
}

/* ****************************************
 *  Process registration
 * **************************************** */
accountCont.registerAccount = async function (req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  let hashedPassword
  try {
    hashedPassword = await bcrypt.hash(account_password, 10)
  } catch (error) {
    req.flash("notice", "Sorry, there was an error processing the registration.")
    return res.status(500).render("account/register", {
      title: "Register",
      nav,
      errors: null,
      account_firstname,
      account_lastname,
      account_email,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult && regResult.rows && regResult.rows.length > 0) {
    req.flash("notice", `Congratulations, ${account_firstname}. Please log in.`)
    return res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    return res.status(501).render("account/register", {
      title: "Register",
      nav,
      errors: null,
      account_firstname,
      account_lastname,
      account_email,
    })
  }
}

/* ****************************************
 *  Process login request
 * **************************************** */
accountCont.accountLogin = async function (req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body

  const accountData = await accountModel.getAccountByEmail(account_email)

  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    return res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
  }

  try {
    const passwordMatch = await bcrypt.compare(
      account_password,
      accountData.account_password
    )

    if (passwordMatch) {
      delete accountData.account_password

      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 60 * 60 }
      )

      if (process.env.NODE_ENV === "development") {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          maxAge: 3600 * 1000,
        })
      } else {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 3600 * 1000,
        })
      }

      return res.redirect("/account/")
    } else {
      req.flash("notice", "Please check your credentials and try again.")
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error("Login process failed.")
  }
}

/* ****************************************
 *  Deliver account management view
 * **************************************** */
accountCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()

  res.render("account/management", {
    title: "Account Management",
    nav,
    errors: null,
  })
}

/* ****************************************
 *  Deliver account update view
 * **************************************** */
accountCont.buildUpdateView = async function (req, res, next) {
  let nav = await utilities.getNav()
  const account_id = parseInt(req.params.account_id)

  const accountData = await accountModel.getAccountById(account_id)

  if (!accountData) {
    req.flash("notice", "Account not found.")
    return res.redirect("/account/")
  }

  res.render("account/update", {
    title: "Update Account",
    nav,
    errors: null,
    account_id: accountData.account_id,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_email: accountData.account_email,
  })
}

/* ****************************************
 *  Process account update
 * **************************************** */
accountCont.updateAccount = async function (req, res, next) {
  let nav = await utilities.getNav()
  const { account_id, account_firstname, account_lastname, account_email } = req.body

  const updateResult = await accountModel.updateAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_id
  )

  if (updateResult) {
    const updatedAccountData = await accountModel.getAccountById(account_id)

    const accessToken = jwt.sign(
      updatedAccountData,
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: 60 * 60 }
    )

    if (process.env.NODE_ENV === "development") {
      res.cookie("jwt", accessToken, {
        httpOnly: true,
        maxAge: 3600 * 1000,
      })
    } else {
      res.cookie("jwt", accessToken, {
        httpOnly: true,
        secure: true,
        maxAge: 3600 * 1000,
      })
    }

    req.flash("notice", "Account information updated successfully.")
    return res.render("account/management", {
      title: "Account Management",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the account update failed.")
    return res.render("account/update", {
      title: "Update Account",
      nav,
      errors: null,
      account_id,
      account_firstname,
      account_lastname,
      account_email,
    })
  }
}

/* ****************************************
 *  Process password update
 * **************************************** */
accountCont.updatePassword = async function (req, res, next) {
  let nav = await utilities.getNav()
  const { account_id, account_password } = req.body

  try {
    const hashedPassword = await bcrypt.hash(account_password, 10)
    const updateResult = await accountModel.updatePassword(
      hashedPassword,
      account_id
    )

    if (updateResult) {
      req.flash("notice", "Password updated successfully.")
      return res.render("account/management", {
        title: "Account Management",
        nav,
        errors: null,
      })
    } else {
      const accountData = await accountModel.getAccountById(account_id)
      req.flash("notice", "Sorry, the password update failed.")
      return res.render("account/update", {
        title: "Update Account",
        nav,
        errors: null,
        account_id: accountData.account_id,
        account_firstname: accountData.account_firstname,
        account_lastname: accountData.account_lastname,
        account_email: accountData.account_email,
      })
    }
  } catch (error) {
    const accountData = await accountModel.getAccountById(account_id)
    req.flash("notice", "Sorry, there was an error updating the password.")
    return res.render("account/update", {
      title: "Update Account",
      nav,
      errors: null,
      account_id: accountData.account_id,
      account_firstname: accountData.account_firstname,
      account_lastname: accountData.account_lastname,
      account_email: accountData.account_email,
    })
  }
}

/* ****************************************
 *  Process logout
 * **************************************** */
accountCont.logout = async function (req, res) {
  res.clearCookie("jwt")
  return res.redirect("/")
}

module.exports = accountCont