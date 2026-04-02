const express = require("express")
const path = require("path")
const expressLayouts = require("express-ejs-layouts")
const session = require("express-session")
const flash = require("connect-flash")
const cookieParser = require("cookie-parser")
require("dotenv").config()

const app = express()

// ================================
// UTILITIES
// ================================
const utilities = require("./utilities")

// ================================
// VIEW ENGINE
// ================================
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

// ================================
// LAYOUTS
// ================================
app.use(expressLayouts)
app.set("layout", "layouts/main")

// ================================
// STATIC FILES
// ================================
app.use(express.static(path.join(__dirname, "public")))

// ================================
// BODY PARSING
// ================================
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// ================================
// COOKIE PARSER
// ================================
app.use(cookieParser())

// ================================
// SESSION & FLASH
// ================================
app.use(
  session({
    secret: process.env.SESSION_SECRET || "superSecretKey",
    resave: false,
    saveUninitialized: true,
    name: "sessionId",
  })
)

app.use(flash())

// ================================
// GLOBAL LOCALS
// ================================
app.use(async (req, res, next) => {
  try {
    res.locals.nav = await utilities.getNav()
    res.locals.notice = req.flash("notice")
    res.locals.loggedin = false
    res.locals.accountData = null
    next()
  } catch (err) {
    next(err)
  }
})

// ================================
// JWT TOKEN CHECK
// ================================
app.use(utilities.checkJWTToken)

// ================================
// ROUTES
// ================================
const inventoryRoute = require("./routes/inventoryRoute")
const accountRoute = require("./routes/accountRoute")

app.use("/inv", inventoryRoute)
app.use("/account", accountRoute)

// ================================
// HOME ROUTE
// ================================
app.get("/", (req, res) => {
  res.render("index", {
    title: "CSE Motors",
  })
})

// ================================
// IGNORE FAVICON REQUESTS
// ================================
app.get("/favicon.ico", (req, res) => res.status(204).end())

// ================================
// 404 HANDLER
// ================================
app.use((req, res, next) => {
  const err = new Error("Page Not Found")
  err.status = 404
  next(err)
})

// ================================
// ERROR HANDLER
// ================================
const errorHandler = require("./middleware/errorHandler")
app.use(errorHandler)

module.exports = app