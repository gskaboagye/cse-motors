const express = require("express");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
require("dotenv").config();

const app = express();

// ================================
// VIEW ENGINE
// ================================
app.set("view engine", "ejs");

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
// BODY PARSING (IMPORTANT)
// ================================
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ================================
// ROUTES
// ================================
const inventoryRoute = require("./routes/inventoryRoute");

// Use inventory routes
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
// 404 HANDLER (REQUIRED)
// ================================
app.use((req, res, next) => {
  const err = new Error("Page Not Found");
  err.status = 404;
  next(err);
});

// ================================
// ERROR HANDLER (REQUIRED)
// ================================
const errorHandler = require("./middleware/errorHandler");
app.use(errorHandler);

// ================================
// SERVER
// ================================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});