const express = require("express")
const path = require("path")
const expressLayouts = require("express-ejs-layouts")
const session = require("express-session")
const flash = require("connect-flash")
const cookieParser = require("cookie-parser")
require("dotenv").config()

const app = express()

// ================================
// REQUIRE ROUTES & UTILITIES
// ================================
const utilities = require("./utilities")
const inventoryRoute = require("./routes/inventoryRoute")
const accountRoute = require("./routes/accountRoute")
const favoriteRoute = require("./routes/favoriteRoute") // ✅ NEW
const errorHandler = require("./middleware/errorHandler")

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
// STATIC FILES & BODY PARSING
// ================================
app.use(express.static(path.join(__dirname, "public")))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// ================================
// COOKIE PARSER
// ================================
app.use(cookieParser())

// ================================
// TRUST PROXY (REQUIRED FOR RENDER)
// ================================
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1)
}

// ================================
// SESSION & FLASH
// ================================
app.use(
  session({
    secret: process.env.SESSION_SECRET || "superSecretKey",
    resave: false,
    saveUninitialized: false,
    name: "sessionId",
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60, // 1 hour
    },
  })
)

app.use(flash())

// ================================
// GLOBAL LOCALS
// ================================
app.use(async (req, res, next) => {
  res.locals.notice = req.flash("notice")
  res.locals.loggedin = false
  res.locals.accountData = null
  res.locals.nav = ""

  try {
    res.locals.nav = await utilities.getNav()
  } catch (err) {
    console.error("Navigation load error:", err.message)
    res.locals.nav = ""
  }

  next()
})

// ================================
// JWT AUTH MIDDLEWARE
// ================================
app.use(utilities.checkJWTToken)

// ================================
// HEALTH CHECK (FOR RENDER)
// ================================
app.get("/healthz", (req, res) => {
  res.status(200).send("ok")
})

// ================================
// ROUTES
// ================================
app.use("/inv", inventoryRoute)
app.use("/account", accountRoute)
app.use("/favorites", favoriteRoute) // ✅ NEW ROUTE

// ================================
// HOME ROUTE
// ================================
app.get("/", (req, res) => {
  res.render("index", {
    title: "CSE Motors",
  })
})

// ================================
// IGNORE FAVICON
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
app.use(errorHandler)

// ================================
module.exports = app