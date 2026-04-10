const express = require("express")
const path = require("path")
const expressLayouts = require("express-ejs-layouts")
const session = require("express-session")
const flash = require("connect-flash")
const cookieParser = require("cookie-parser")
require("dotenv").config()

const app = express()

const utilities = require("./utilities")
const inventoryRoute = require("./routes/inventoryRoute")
const accountRoute = require("./routes/accountRoute")
const errorHandler = require("./middleware/errorHandler")

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

app.use(expressLayouts)
app.set("layout", "layouts/main")

app.use(express.static(path.join(__dirname, "public")))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1)
}

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
      maxAge: 1000 * 60 * 60,
    },
  })
)

app.use(flash())

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

app.use(utilities.checkJWTToken)

app.get("/healthz", (req, res) => {
  res.status(200).send("ok")
})

app.use("/inv", inventoryRoute)
app.use("/account", accountRoute)

app.get("/", (req, res) => {
  res.render("index", {
    title: "CSE Motors",
  })
})

app.get("/favicon.ico", (req, res) => res.status(204).end())

app.use((req, res, next) => {
  const err = new Error("Page Not Found")
  err.status = 404
  next(err)
})

app.use(errorHandler)

module.exports = app