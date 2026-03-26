const express = require("express");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
require("dotenv").config();

const app = express();

// ================================
// VIEW ENGINE
// ================================
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ================================
// LAYOUTS
// ================================
app.use(expressLayouts);
app.set("layout", "layouts/main");

// ================================
// STATIC FILES
// ================================
app.use(express.static(path.join(__dirname, "public")));

// ================================
// BODY PARSING
// ================================
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ================================
// GLOBAL NAVIGATION
// ================================
const utilities = require("./utilities");

app.use(async (req, res, next) => {
  try {
    res.locals.nav = "";
    res.locals.nav = await utilities.getNav();
    next();
  } catch (err) {
    next(err);
  }
});

// ================================
// ROUTES
// ================================
const inventoryRoute = require("./routes/inventoryRoute");
app.use("/inv", inventoryRoute);

// ================================
// HOME ROUTE
// ================================
app.get("/", (req, res) => {
  res.render("index", {
    title: "CSE Motors"
  });
});

// ================================
// 404 HANDLER
// ================================
app.use((req, res, next) => {
  const err = new Error("Page Not Found");
  err.status = 404;
  next(err);
});

// ================================
// ERROR HANDLER
// ================================
const errorHandler = require("./middleware/errorHandler");
app.use(errorHandler);

module.exports = app;